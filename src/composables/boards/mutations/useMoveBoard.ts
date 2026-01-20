import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { patchCounter } from '@/utils/queries/patchCounter'
import { toast } from 'vue-sonner'
import { useUndo } from '@/composables/useUndo'
import { IBoard } from '@/interfaces/domain/IBoard'
import { saveBoard } from '@/services/board'

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

    onSuccess: async (result, { oldWorkspaceId, newWorkspaceId }) => {
      if (oldWorkspaceId !== newWorkspaceId) {
        patchCounter(queryClient, workspaceKeys.lists(), oldWorkspaceId || '', 'boardsCount', -1)

        patchCounter(queryClient, workspaceKeys.lists(), newWorkspaceId || '', 'boardsCount', 1)
      }

      toast.success('Доска успешно перемещена', {
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
