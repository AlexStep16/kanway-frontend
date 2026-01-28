import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { chatMessageKeys } from '@/keys'
import { fetchChatMessages } from '@/services/chatMessage'

export function useChatMessages(chatId: MaybeRef<string | null>) {
  return useQuery({
    queryKey: chatMessageKeys.byChat(chatId),
    queryFn: () => fetchChatMessages(toValue(chatId)!),
    enabled: computed(() => !!toValue(chatId)),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  })
}
