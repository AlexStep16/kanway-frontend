import { fetchChats } from '~/services/chat'
import { useQuery } from '@tanstack/vue-query'

export function useChats(workspaceId: MaybeRef<string | null>) {
  return useQuery({
    queryKey: chatKeys.byWorkspace(workspaceId),
    queryFn: () => fetchChats(toValue(workspaceId)!),
    enabled: computed(() => !!toValue(workspaceId)),
    staleTime: 5 * 60 * 1000,
  })
}
