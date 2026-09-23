import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import { removeColumn } from '~/services/column'

interface DeleteColumnVars {
  column: IColumnState
}

export function useDeleteColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...columnKeys.all, 'delete'],
    meta: {
      keysToInvalidate: [columnKeys.archived()],
    },
    mutationFn: ({ column }: DeleteColumnVars) =>
      requestQueueService.enqueue(column.id, () => removeColumn(column.id)),
    onMutate: async ({ column }) => {
      const columnKey = columnKeys.byBoard(column.board.id)

      await queryClient.cancelQueries({ queryKey: columnKey })

      const previousColumns = queryClient.getQueryData<IColumnState[]>(columnKey)

      if (previousColumns) {
        queryClient.setQueryData<IColumnState[]>(columnKey, (oldColumns) =>
          oldColumns ? oldColumns.filter((c) => c.id !== column.id) : [],
        )
      }

      return { previousColumns, columnKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousColumns) {
        const columnToRestore = context.previousColumns.find((c) => c.id === vars.column.id)

        if (columnToRestore) {
          queryClient.setQueryData<IColumnState[]>(context.columnKey, (current) => {
            if (current?.some((c) => c.id === vars.column.id)) return current

            return [columnToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: (data, error, { column }) => {
      queryClient.invalidateQueries({
        queryKey: columnKeys.byBoard(column.board.id),
      })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(column.board.id) })
      queryClient.invalidateQueries({ queryKey: columnKeys.detailed(column.id) })
    },

    onSuccess: () => {
      toast.success('Колонка успешно удалена')
    },
  })
}
