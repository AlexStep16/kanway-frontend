import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { toast } from 'vue-sonner'
import { useUndo } from '@/composables/useUndo'
import { ICategory } from '@/interfaces/domain/ICategory'
import { saveCategory } from '@/services/category'

interface MoveCategoryVars {
  payload: ISingleUpdate<ICategory>
  oldBoardId: string
  newBoardId: string
  oldWorkspaceId: string
  newWorkspaceId: string
}

export function useMoveCategory() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'move'],
    mutationFn: ({ payload }: MoveCategoryVars) =>
      requestQueueService.enqueue(payload.id, () => saveCategory(payload)),
    onSuccess: async (
      result,
      { oldBoardId, newBoardId, oldWorkspaceId, newWorkspaceId, payload },
    ) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(oldBoardId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(newBoardId) })

      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(oldBoardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(newBoardId) })

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newWorkspaceId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(payload.id) })

      if (oldWorkspaceId !== newWorkspaceId) {
        queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      }

      toast.success('Категория успешно перемещена', {
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
