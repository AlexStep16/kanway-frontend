import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { ITask } from '~/interfaces/domain/ITask'
import { saveTask } from '~/services/task'
import { toast } from 'vue-sonner'

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
    mutationFn: ({ payload, newCategoryId, newBoardId, newWorkspaceId }: MoveTaskVars) =>
      requestQueueService.enqueue(payload.id, () =>
        saveTask({
          id: payload.id,
          categoryId: newCategoryId,
          boardId: newBoardId,
          workspaceId: newWorkspaceId,
        }),
      ),
    onSuccess: async (result, { oldBoardId, newBoardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(payload.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(oldBoardId) })

      if (oldBoardId !== newBoardId) {
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(newBoardId) })
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
