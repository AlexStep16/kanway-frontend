import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IColumnEditApiPayload } from '~/interfaces/IColumnEditApiPayload'
import { saveColumn } from '~/services/column'

interface MoveColumnVars {
  payload: IColumnEditApiPayload
  oldBoardId: string
  newBoardId: string
}

export function useMoveColumn() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...columnKeys.all, 'move'],
    mutationFn: ({ payload }: MoveColumnVars) =>
      requestQueueService.enqueue(payload.id, () => saveColumn(payload)),
    onSuccess: async (result, { oldBoardId, newBoardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(oldBoardId) })
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(newBoardId) })

      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(oldBoardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(newBoardId) })

      queryClient.invalidateQueries({ queryKey: columnKeys.detailed(payload.id) })

      toast.success('Колонка успешно перемещена', {
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
