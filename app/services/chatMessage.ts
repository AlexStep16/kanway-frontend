import ChatMessageModel from '~/models/ChatMessageModel'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'

export function transformChatMessage(raw: IChatMessage): ChatMessageModel {
  return new ChatMessageModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchChatMessages(chatId: string) {
  const chatMessages = await getChatMessagesApi(chatId)

  return chatMessages.map(transformChatMessage)
}
