import { IChat } from '@/interfaces/domain/IChat'
import { chatKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { fetchChat } from '@/services/chat'
import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'

export function useChat(id: MaybeRef<string | null>, workspaceId: MaybeRef<string | null>) {
  return useQuery({
    queryKey: chatKeys.detailed(id),
    queryFn: () => fetchChat(toValue(id)!),
    enabled: computed(() => !!toValue(id)),
    initialData: () => {
      const allChats = queryClient.getQueryData<IChat[]>(chatKeys.byWorkspace(workspaceId))
      return allChats?.find((chat) => chat.id === toValue(id)) || null
    },
    initialDataUpdatedAt: () => {
      return workspaceId
        ? queryClient.getQueryState(chatKeys.byWorkspace(workspaceId))?.dataUpdatedAt
        : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}
