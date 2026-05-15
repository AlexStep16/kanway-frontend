import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { saveBoard } from '~/services/board'

interface MoveBoardVars {
  payload: IBoard
  oldWorkspaceId: string
  newWorkspaceId: string
}

export function useMoveBoard() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'move'],
    mutationFn: ({ payload }: MoveBoardVars) =>
      requestQueueService.enqueue(payload.id, () => saveBoard(payload)),

    onSuccess: async (result) => {
      toast.success('Доска успешно перемещена', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },

    onSettled: (data, error, { oldWorkspaceId, newWorkspaceId, payload }) => {
      queryClient.invalidateQueries({
        queryKey: [...boardKeys.count(), oldWorkspaceId],
      })
      queryClient.invalidateQueries({
        queryKey: [...boardKeys.count(), newWorkspaceId],
      })
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(oldWorkspaceId) })
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newWorkspaceId) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(payload.id) })

      // Invalidate related categories and tasks to update their workspace references
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(payload.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(payload.id) })
    },
  })
}
