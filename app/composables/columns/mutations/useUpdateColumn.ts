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
      const queryKey = vars.boardId ? columnKeys.byBoard(vars.boardId) : columnKeys.all

      await queryClient.cancelQueries({ queryKey })

      const previousColumns = queryClient.getQueryData<IColumnState[]>(queryKey)

      if (previousColumns) {
        queryClient.setQueryData<IColumnState[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      return { previousColumns, queryKey }
    },

    onSettled: (data, error, { boardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: columnKeys.detailed(payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousColumns) {
        const originalColumn = context.previousColumns.find((c) => c.id === vars.payload.id)

        if (originalColumn) {
          queryClient.setQueryData<IColumnState[]>(context.queryKey, (current) => {
            return current?.map((c) => (c.id === vars.payload.id ? originalColumn : c)) ?? []
          })
        }
      }
    },
  })
}
