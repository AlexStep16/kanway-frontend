import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { moveColumn } from '~/services/column'
import type { IColumnState } from '~/stores/interfaces/IColumnState'

export interface MoveColumnCardVars {
  id: string
  beforeId?: string | null
  afterId?: string | null
  newBoardId?: string
  boardId: MaybeRef<string | null>
}

export function useMoveColumnCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...columnKeys.all, 'move-card'],
    mutationFn: async ({ id, beforeId, afterId, newBoardId }: MoveColumnCardVars) =>
      moveColumn({ id, beforeId, afterId, newBoardId }),

    onMutate: async (vars) => {
      const queryKey = columnKeys.byBoard(vars.boardId)

      await queryClient.cancelQueries({ queryKey })

      const previousColumns = queryClient.getQueryData<IColumnState[]>(queryKey)

      queryClient.setQueryData(queryKey, (oldColumns: IColumnState[] | undefined) => {
        if (!oldColumns) return []

        const movingColumn = oldColumns.find((column) => column.id === vars.id)

        if (!movingColumn) return oldColumns

        const nextColumns = oldColumns.filter((column) => column.id !== vars.id)

        let insertIndex = nextColumns.length

        if (vars.afterId) {
          const afterIndex = nextColumns.findIndex((column) => column.id === vars.afterId)

          if (afterIndex !== -1) {
            insertIndex = afterIndex + 1
          }
        } else if (vars.beforeId) {
          const beforeIndex = nextColumns.findIndex((column) => column.id === vars.beforeId)

          if (beforeIndex !== -1) {
            insertIndex = beforeIndex
          }
        }

        nextColumns.splice(insertIndex, 0, {
          ...movingColumn,
          board: vars.newBoardId
            ? { ...movingColumn.board, id: vars.newBoardId }
            : movingColumn.board,
        })

        return nextColumns
      })

      return { previousColumns, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(context.queryKey, context.previousColumns)
      }
    },

    onSettled: (data, error, { boardId, newBoardId }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(boardId) })

      if (newBoardId && newBoardId !== toValue(boardId)) {
        queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(newBoardId) })
      }
    },
  })
}
