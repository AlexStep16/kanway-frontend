import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { ITask } from '@/interfaces/domain/ITask'
import { saveTask } from '@/services/task'
import { requestQueueService } from '@/utils/RequestQueueService'
import { patchCounter } from '@/utils/queries/patchCounter'
import { toast } from 'vue-sonner'
import { useUndo } from '@/composables/useUndo'

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
      {
        payload,
        oldCategoryId,
        newCategoryId,
        oldBoardId,
        newBoardId,
        oldWorkspaceId,
        newWorkspaceId,
      },
    ) => {
      if (payload.isDeleted) return

      if (oldCategoryId !== newCategoryId) {
        patchCounter(
          queryClient,
          categoryKeys.byBoard(oldBoardId),
          oldCategoryId || '',
          'tasksCount',
          -1,
        )

        patchCounter(
          queryClient,
          categoryKeys.byBoard(newBoardId),
          newCategoryId || '',
          'tasksCount',
          1,
        )
      }

      if (oldBoardId !== newBoardId) {
        patchCounter(
          queryClient,
          boardKeys.byWorkspace(oldWorkspaceId),
          oldBoardId || '',
          'tasksCount',
          -1,
        )

        patchCounter(
          queryClient,
          boardKeys.byWorkspace(newWorkspaceId),
          newBoardId || '',
          'tasksCount',
          1,
        )
      }

      if (oldWorkspaceId !== newWorkspaceId) {
        patchCounter(queryClient, workspaceKeys.lists(), oldWorkspaceId || '', 'tasksCount', -1)
        patchCounter(queryClient, workspaceKeys.lists(), newWorkspaceId || '', 'tasksCount', 1)
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
