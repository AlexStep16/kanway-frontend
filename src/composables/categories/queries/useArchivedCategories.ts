import { categoryKeys } from '@/keys'
import { fetchArchivedCategories } from '@services/category'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef } from 'vue'

export function useArchivedCategories(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: categoryKeys.archived(),
    queryFn: () => fetchArchivedCategories(),
    placeholderData: (prev) => prev,
    initialData: () => [],
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  })
}
