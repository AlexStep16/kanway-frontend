import { chatKeys } from '@/keys'
import { fetchChats } from '@/services/chat'
import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'

export function useChats(workspaceId: MaybeRef<string | null>) {
  return useQuery({
    queryKey: chatKeys.byWorkspace(workspaceId),
    queryFn: () => fetchChats(toValue(workspaceId)!),
    enabled: computed(() => !!toValue(workspaceId)),
    staleTime: 5 * 60 * 1000,
  })
}
