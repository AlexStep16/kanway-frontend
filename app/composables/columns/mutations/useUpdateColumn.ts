import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { saveColumn } from '~/services/column'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import type { IColumnEditApiPayload } from '~/interfaces/IColumnEditApiPayload'

interface UpdateColumnVars {
  payload: IColumnEditApiPayload
  boardId: string | null
}

export function useUpdateColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...columnKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateColumnVars) =>
      requestQueueService.enqueue(payload.id, () => saveColumn(payload)),

    onMutate: async (vars) => {
      const queryColumnsKey = vars.boardId ? columnKeys.byBoard(vars.boardId) : columnKeys.all
      const queryColumnKey = columnKeys.detailed(vars.payload.id)

      await queryClient.cancelQueries({ queryKey: queryColumnsKey })
      await queryClient.cancelQueries({ queryKey: queryColumnKey })

      const previousColumns = queryClient.getQueryData<IColumnState[]>(queryColumnsKey)
      const previousColumn = queryClient.getQueryData<IColumnState>(queryColumnKey)

      if (previousColumns) {
        queryClient.setQueryData<IColumnState[]>(queryColumnsKey, (old) => {
          if (!old) return []
          return old.map((c) => (c.id === vars.payload.id ? { ...c, ...vars.payload } : c))
        })
      }

      if (previousColumn) {
        queryClient.setQueryData<IColumnState | null>(queryColumnKey, (old) => {
          if (!old) return null
          return { ...old, ...vars.payload }
        })
      }

      return { previousColumns, previousColumn, queryColumnsKey, queryColumnKey }
    },

    onSettled: (data, error, { boardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.archived() })
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: columnKeys.detailed(payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousColumns) {
        const originalColumn = context.previousColumns.find((c) => c.id === vars.payload.id)

        if (originalColumn) {
          queryClient.setQueryData<IColumnState[]>(context.queryColumnsKey, (current) => {
            return current?.map((c) => (c.id === vars.payload.id ? originalColumn : c)) ?? []
          })
        }
      }

      if (context?.previousColumn) {
        queryClient.setQueryData<IColumnState>(context.queryColumnKey, context.previousColumn)
      }
    },
  })
}
