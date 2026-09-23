import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import { recoverColumn } from '~/services/column'

interface RecoverColumnVars {
  column: IColumnState
}

export function useRecoverColumn() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...columnKeys.all, 'recover'],
    meta: {
      keysToInvalidate: [columnKeys.archived()],
    },
    mutationFn: ({ column }: RecoverColumnVars) =>
      requestQueueService.enqueue(column.id, () => recoverColumn(column.id)),

    onMutate: async ({ column }) => {
      const actualColumnsKey = columnKeys.byBoard(column.board.id)
      const archivedColumnsKey = columnKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualColumnsKey })
      await queryClient.cancelQueries({ queryKey: archivedColumnsKey })

      const prevArchived = queryClient.getQueryData<IColumnState[]>(archivedColumnsKey)
      const prevColumns = queryClient.getQueryData<IColumnState[]>(actualColumnsKey)

      if (prevArchived) {
        queryClient.setQueryData<IColumnState[]>(archivedColumnsKey, (old) =>
          old ? old.filter((c) => c.id !== column.id) : [],
        )
      }

      if (prevColumns) {
        queryClient.setQueryData<IColumnState[]>(actualColumnsKey, (old) =>
          old ? [...old, { ...column, isDeleted: false }] : [{ ...column, isDeleted: false }],
        )
      }

      return { prevArchived, prevColumns, archivedColumnsKey, actualColumnsKey }
    },

    onError: (err, vars, context) => {
      if (context?.actualColumnsKey) {
        queryClient.setQueryData<IColumnState[]>(context.actualColumnsKey, (current) => {
          return current?.filter((c) => c.id !== vars.column.id) || []
        })
      }

      if (context?.prevArchived) {
        const columnToRestore = context.prevArchived.find((c) => c.id === vars.column.id)

        if (columnToRestore) {
          queryClient.setQueryData<IColumnState[]>(context.archivedColumnsKey, (current) => {
            if (current?.some((c) => c.id === vars.column.id)) return current
            return [columnToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: (result, error, { column }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(column.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(column.board.id) })
      queryClient.invalidateQueries({ queryKey: columnKeys.detailed(column.id) })
    },

    onSuccess: (result) => {
      toast.success('Колонка восстановлена', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },
  })
}
