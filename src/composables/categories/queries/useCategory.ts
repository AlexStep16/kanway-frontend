import { categoryKeys } from '@/keys'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useCategory as useCategoryFunction } from '../useCategory'
import { MaybeRef, toValue } from 'vue'
import { fetchCategory } from '@/services/category'

export function useCategory(id: MaybeRef<string>, boardId?: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: categoryKeys.detailed(id),
    queryFn: () => fetchCategory(toValue(id)),
    enabled: !!toValue(id),

    initialData: () => {
      if (!boardId) return undefined

      return useCategoryFunction(id, boardId).value ?? undefined
    },

    initialDataUpdatedAt: () => {
      return boardId
        ? queryClient.getQueryState(categoryKeys.byBoard(boardId))?.dataUpdatedAt
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
