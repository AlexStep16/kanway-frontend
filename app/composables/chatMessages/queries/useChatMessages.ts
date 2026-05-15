import { useQuery } from '@tanstack/vue-query'
import { fetchChatMessages } from '~/services/chatMessage'
import { useChatStore } from '~/stores/chat'

export function useChatMessages(
  chatId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const chatStore = useChatStore()

  return useQuery({
    queryKey: chatMessageKeys.byChat(chatId),
    queryFn: () => fetchChatMessages(toValue(chatId)!),
    enabled: computed(() => {
      const id = toValue(chatId)
      return !!id && id !== chatStore.temporaryChatId && toValue(isEnabled)
    }),
    initialData: () => [],
    staleTime: Infinity,
  })
}
