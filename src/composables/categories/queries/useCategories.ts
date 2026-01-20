import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { categoryKeys } from '@/keys'
import { fetchCategories } from '@services/category'

export function useCategories(
  boardId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  return useQuery({
    queryKey: categoryKeys.byBoard(boardId),
    queryFn: () => fetchCategories(toValue(boardId)!),
    enabled: computed(() => !!toValue(boardId) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    initialData: () => [],
    staleTime: 1000 * 60 * 5,
  })
}
