import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

export async function getChatMessagesApi(chatId: string) {
  return await apiCall<IChatMessage[]>({
    method: 'GET',
    url: `/chat-messages/${chatId}`,
  })
}
