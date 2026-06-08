import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import { archiveColumn } from '~/services/column'

interface ArchiveColumnVars {
  column: IColumnState
}

export function useArchiveColumn() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...columnKeys.all, 'archive'],
    meta: {
      keysToInvalidate: [columnKeys.archived()],
    },
    mutationFn: ({ column }: ArchiveColumnVars) =>
      requestQueueService.enqueue(column.id, () => archiveColumn(column.id)),
    onMutate: async ({ column }) => {
      const actualColumnsKey = columnKeys.byBoard(column.board.id)
      const archivedColumnsKey = columnKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualColumnsKey })
      await queryClient.cancelQueries({ queryKey: archivedColumnsKey })

      const prevColumns = queryClient.getQueryData<IColumnState[]>(actualColumnsKey)
      const prevArchived = queryClient.getQueryData<IColumnState[]>(archivedColumnsKey)

      if (prevColumns) {
        queryClient.setQueryData<IColumnState[]>(actualColumnsKey, (old) =>
          old ? old.filter((c) => c.id !== column.id) : [],
        )
      }

      if (prevArchived) {
        queryClient.setQueryData<IColumnState[]>(archivedColumnsKey, (old) =>
          old ? [...old, { ...column, isDeleted: true }] : [{ ...column, isDeleted: true }],
        )
      }

      return { prevArchived, prevColumns, archivedColumnsKey, actualColumnsKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevColumns) {
        const columnToRestore = context.prevColumns.find((c) => c.id === vars.column.id)

        if (columnToRestore) {
          queryClient.setQueryData<IColumnState[]>(context.actualColumnsKey, (current) => {
            if (current?.some((c) => c.id === vars.column.id)) return current
            return [columnToRestore, ...(current || [])]
          })
        }
      }

      if (context?.archivedColumnsKey) {
        queryClient.setQueryData<IColumnState[]>(context.archivedColumnsKey, (current) => {
          return current?.filter((c) => c.id !== vars.column.id) || []
        })
      }
    },

    onSuccess: (result) => {
      toast.success('Колонка архивирована', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },

    onSettled: (data, error, { column }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(column.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(column.board.id) })
      queryClient.invalidateQueries({ queryKey: columnKeys.detailed(column.id) })
    },
  })
}
