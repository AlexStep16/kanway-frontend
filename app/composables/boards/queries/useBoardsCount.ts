import { useQuery } from '@tanstack/vue-query'
import { fetchBoardsCount } from '~/services/board'

export function useBoardsCount(
  workspaceId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  return useQuery({
    queryKey: computed(() => [...boardKeys.count(), toValue(workspaceId)]),
    queryFn: () => fetchBoardsCount(toValue(workspaceId)),
    enabled: computed(() => toValue(isEnabled) && !!toValue(workspaceId)),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
