import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { IColumn } from '~/interfaces/domain/IColumn'
import { createColumn } from '~/services/column'
import type { IColumnCreateApiPayload } from '~/interfaces/IColumnCreateApiPayload'

interface CreateColumnVars {
  payload: IColumnCreateApiPayload
}

export function useCreateColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...columnKeys.all, 'create'],
    mutationFn: async ({ payload }: CreateColumnVars) => createColumn(payload),

    onSuccess: async (result, { payload }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(payload.boardId) })

      queryClient.setQueryData(
        columnKeys.byBoard(payload.boardId),
        (oldColumns: IColumn[] | undefined) => {
          return oldColumns ? [...oldColumns, ...result.data] : result.data
        },
      )
    },
  })
}
