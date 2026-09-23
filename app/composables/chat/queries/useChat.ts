import type { IChat } from '~/interfaces/domain/IChat'
import { fetchChat } from '~/services/chat'
import { useChatStore } from '~/stores/chat'
import { useQuery, useQueryClient } from '@tanstack/vue-query'

export function useChat(id: MaybeRef<string | null>, workspaceId: MaybeRef<string | null>) {
  const chatStore = useChatStore()
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: chatKeys.detailed(id),
    queryFn: () => fetchChat(toValue(id)!),
    enabled: computed(() => !!toValue(id) && chatStore.temporaryChatId !== toValue(id)),
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
