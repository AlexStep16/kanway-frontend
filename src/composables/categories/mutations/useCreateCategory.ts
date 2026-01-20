import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { patchCounter } from '@/utils/queries/patchCounter'
import { ICategory } from '@/interfaces/domain/ICategory'
import { createCategory } from '@/services/category'
import { useUndo } from '@/composables/useUndo'

interface CreateCategoryVars {
  payload: Partial<ICategory>
  boardId: string | null
  workspaceId: string | null
}

export function useCreateCategory() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'create'],
    mutationFn: async ({ payload, boardId, workspaceId }: CreateCategoryVars) => {
      if (!workspaceId) {
        throw new Error('Не выбрано пространство')
      }

      if (!boardId) {
        throw new Error('Не выбрана доска')
      }

      return createCategory(payload, boardId, workspaceId)
    },

    onSuccess: async (result, { boardId, workspaceId }) => {
      patchCounter(queryClient, boardKeys.byWorkspace(workspaceId), boardId!, 'categoriesCount', 1)
      patchCounter(queryClient, workspaceKeys.all, workspaceId!, 'categoriesCount', 1)

      if (result.data.length === 0) {
        return toast.error('Произошла ошибка при создании категории')
      }

      toast.success('Категория успешно создана', {
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
