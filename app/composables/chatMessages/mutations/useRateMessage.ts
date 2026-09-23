import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import { rateChatMessage } from '~/services/chatMessage'

interface RateMessageVars {
  id: string
  chatId?: string | null
  rating: boolean
}

export function useRateMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatMessageKeys.all, 'rate'],
    mutationFn: (vars: RateMessageVars) => rateChatMessage({ rating: vars.rating }, vars.id),

    onMutate: async ({ id, chatId, rating }) => {
      if (!chatId) return

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(chatId),
        (oldMessages = []) => {
          if (!oldMessages) return []
          return oldMessages.map((m) => (m.id === id ? { ...m, rating } : m))
        },
      )
    },

    onSuccess: () => {
      toast.success('Спасибо за ваш отзыв!')
    },
  })
}
