import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { boardKeys } from '@/keys'
import { fetchBoardsCount } from '@services/board'

export function useBoardsCount(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: [...boardKeys.all, 'count'],
    queryFn: () => fetchBoardsCount(),
    enabled: computed(() => toValue(isEnabled)),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
