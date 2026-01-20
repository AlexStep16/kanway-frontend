import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { patchCounter } from '@/utils/queries/patchCounter'
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
    onSuccess: async (result, { oldBoardId, newBoardId, oldWorkspaceId, newWorkspaceId }) => {
      if (oldBoardId !== newBoardId) {
        patchCounter(
          queryClient,
          boardKeys.byWorkspace(oldWorkspaceId),
          oldBoardId || '',
          'categoriesCount',
          -1,
        )

        patchCounter(
          queryClient,
          boardKeys.byWorkspace(newWorkspaceId),
          newBoardId || '',
          'categoriesCount',
          1,
        )
      }

      if (oldWorkspaceId !== newWorkspaceId) {
        patchCounter(
          queryClient,
          workspaceKeys.lists(),
          oldWorkspaceId || '',
          'categoriesCount',
          -1,
        )
        patchCounter(queryClient, workspaceKeys.lists(), newWorkspaceId || '', 'categoriesCount', 1)
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
