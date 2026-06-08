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

        oldColumns.map((column) => {
          if (column.id === vars.id) {
            return { ...column, board: vars.newBoardId ?? column.board }
          }
          return column
        })
      })

      return { previousColumns, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(context.queryKey, context.previousColumns)
      }
    },

    onSettled: (data, error, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(boardId) })
    },
  })
}
