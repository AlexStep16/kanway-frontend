import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { moveCategory } from '~/services/category'
import type { ICategoryState } from '~/stores/interfaces/ICategoryState'

export interface MoveCategoryCardVars {
  id: string
  beforeId?: string | null
  afterId?: string | null
  newBoardId?: string
  boardId: MaybeRef<string | null>
}

export function useMoveCategoryCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'move-card'],
    mutationFn: async ({ id, beforeId, afterId, newBoardId }: MoveCategoryCardVars) =>
      moveCategory({ id, beforeId, afterId, newBoardId }),

    onMutate: async (vars) => {
      const queryKey = categoryKeys.byBoard(vars.boardId)

      await queryClient.cancelQueries({ queryKey })

      const previousCategories = queryClient.getQueryData<ICategoryState[]>(queryKey)

      queryClient.setQueryData(queryKey, (oldCategories: ICategoryState[] | undefined) => {
        if (!oldCategories) return []

        oldCategories.map((category) => {
          if (category.id === vars.id) {
            return { ...category, board: vars.newBoardId ?? category.board }
          }
          return category
        })
      })

      return { previousCategories, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(context.queryKey, context.previousCategories)
      }
    },

    onSettled: (data, error, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(boardId) })
    },
  })
}
