import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { categoryKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategory } from '@/interfaces/domain/ICategory'
import { saveCategory } from '@/services/category'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'

interface UpdateCategoryVars {
  payload: ISingleUpdate<ICategory>
  boardId?: string
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateCategoryVars) =>
      requestQueueService.enqueue(payload.id, () => saveCategory(payload)),

    onMutate: async (vars) => {
      const queryKey = vars.boardId ? categoryKeys.byBoard(vars.boardId) : categoryKeys.all

      await queryClient.cancelQueries({ queryKey })

      const previousCategories = queryClient.getQueryData<ICategoryState[]>(queryKey)

      if (previousCategories) {
        queryClient.setQueryData<ICategoryState[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      return { previousCategories, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(context.queryKey, context.previousCategories)
      }
    },
  })
}
