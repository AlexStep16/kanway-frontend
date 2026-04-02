import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { ICategory } from '@/interfaces/domain/ICategory'
import { createCategory } from '@/services/category'
import { useUndo } from '@/composables/logs/useUndo'

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

    onSuccess: async (result, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(boardId) })

      queryClient.setQueryData(
        categoryKeys.byBoard(boardId),
        (oldCategories: ICategory[] | undefined) => {
          return oldCategories ? [...oldCategories, ...result.data] : result.data
        },
      )

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
