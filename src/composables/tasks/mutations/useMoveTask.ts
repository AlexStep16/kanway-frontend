import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { ITask } from '@/interfaces/domain/ITask'
import { saveTask } from '@/services/task'
import { requestQueueService } from '@/utils/RequestQueueService'
import { toast } from 'vue-sonner'
import { useUndo } from '@/composables/logs/useUndo'

export interface MoveTaskVars {
  payload: ISingleUpdate<ITask>

  oldCategoryId: string
  newCategoryId: string
  oldBoardId: string
  newBoardId: string
  oldWorkspaceId: string
  newWorkspaceId: string
}

export function useMoveTask() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'move'],
    mutationFn: ({ payload }: MoveTaskVars) =>
      requestQueueService.enqueue(payload.id, () => saveTask(payload)),
    onSuccess: async (
      result,
      { oldBoardId, newBoardId, oldWorkspaceId, newWorkspaceId, payload },
    ) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(payload.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(oldBoardId) })

      if (oldBoardId !== newBoardId) {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(oldWorkspaceId) })
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newWorkspaceId) })

        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(oldBoardId) })
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(newBoardId) })

        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(oldBoardId) })
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(newBoardId) })
      }

      if (oldWorkspaceId !== newWorkspaceId) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      }

      toast.success('Задача успешно перемещена', {
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
