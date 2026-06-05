import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { RateMessagePayload } from '~/interfaces/RateMessagePayload'

export async function getChatMessagesApi(chatId: string) {
  return await apiCall<IChatMessage[]>({
    method: 'GET',
    url: `/chat-messages/${chatId}`,
  })
}

export async function rateChatMessageApi(data: RateMessagePayload, id: string) {
  return await apiCall<IChatMessage>({
    method: 'PATCH',
    url: `/chat-messages/${id}/rate`,
    data,
  })
}
