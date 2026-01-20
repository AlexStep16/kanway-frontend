import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { categoryKeys } from '@/keys' // Твои ключи кэша
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { removeCategory } from '@/services/category'

interface DeleteCategoryVars {
  category: ICategoryState
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'delete'],
    mutationFn: ({ category }: DeleteCategoryVars) =>
      requestQueueService.enqueue(category.id, () => removeCategory(category.id)),
    onMutate: async ({ category }) => {
      const categoryKey = categoryKeys.byBoard(category.board.id)

      await queryClient.cancelQueries({ queryKey: categoryKey })

      const previousCategories = queryClient.getQueryData<ICategoryState[]>(categoryKey)

      if (previousCategories) {
        queryClient.setQueryData<ICategoryState[]>(categoryKey, (oldCategories) =>
          oldCategories ? oldCategories.filter((c) => c.id !== category.id) : [],
        )
      }

      return { previousCategories, categoryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(context.categoryKey, context.previousCategories)
      }
    },

    onSuccess: () => {
      toast.success('Категория успешно удалена')
    },
  })
}
