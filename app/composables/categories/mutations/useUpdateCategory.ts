import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { saveCategory } from '~/services/category'
import type { ICategoryState } from '~/stores/interfaces/ICategoryState'
import type { ICategoryEditApiPayload } from '~/interfaces/ICategoryEditApiPayload'

interface UpdateCategoryVars {
  payload: ICategoryEditApiPayload
  boardId: string | null
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

    onSettled: (data, error, { boardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousCategories) {
        const originalCategory = context.previousCategories.find((c) => c.id === vars.payload.id)

        if (originalCategory) {
          queryClient.setQueryData<ICategoryState[]>(context.queryKey, (current) => {
            return current?.map((c) => (c.id === vars.payload.id ? originalCategory : c)) ?? []
          })
        }
      }
    },
  })
}
