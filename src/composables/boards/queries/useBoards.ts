import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { boardKeys } from '@/keys'
import { fetchBoards } from '@services/board'

export function useBoards(
  workspaceId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  return useQuery({
    queryKey: boardKeys.byWorkspace(workspaceId),
    queryFn: () => fetchBoards(toValue(workspaceId)!),
    enabled: computed(() => !!toValue(workspaceId) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
