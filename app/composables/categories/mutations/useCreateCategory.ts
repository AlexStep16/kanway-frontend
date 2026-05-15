import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { ICategory } from '~/interfaces/domain/ICategory'
import { createCategory } from '~/services/category'
import type { ICategoryCreateApiPayload } from '~/interfaces/ICategoryCreateApiPayload'

interface CreateCategoryVars {
  payload: ICategoryCreateApiPayload
}

export function useCreateCategory() {
  const { mutate: undo } = useUndo()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'create'],
    mutationFn: async ({ payload }: CreateCategoryVars) => createCategory(payload),

    onSuccess: async (result, { payload }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(payload.boardId) })

      queryClient.setQueryData(
        categoryKeys.byBoard(payload.boardId),
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
