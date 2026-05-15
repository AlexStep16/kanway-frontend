import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { ICategoryState } from '~/stores/interfaces/ICategoryState'
import { removeCategory } from '~/services/category'

interface DeleteCategoryVars {
  category: ICategoryState
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'delete'],
    meta: {
      keysToInvalidate: [categoryKeys.archived()],
    },
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
        const categoryToRestore = context.previousCategories.find((c) => c.id === vars.category.id)

        if (categoryToRestore) {
          queryClient.setQueryData<ICategoryState[]>(context.categoryKey, (current) => {
            if (current?.some((c) => c.id === vars.category.id)) return current

            return [categoryToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: (data, error, { category }) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.byBoard(category.board.id),
      })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(category.id) })
    },

    onSuccess: () => {
      toast.success('Категория успешно удалена')
    },
  })
}
