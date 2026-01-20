import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { categoryKeys } from '@/keys'
import { fetchCategory } from '@/services/category'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { queryClient } from '@/plugins/queryClient'

export function useCategory(id: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: categoryKeys.detailed(id),
    queryFn: () => fetchCategory(toValue(id)!),
    enabled: computed(() => !!toValue(id) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    initialData: () => {
      return queryClient
        .getQueryData<ICategoryState[]>(categoryKeys.all)
        ?.find((c) => c.id === toValue(id))
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(categoryKeys.all)?.dataUpdatedAt,
    staleTime: 1000 * 60 * 5,
  })
}
