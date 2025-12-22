import ChatMessageModel from '@models/ChatMessageModel'
import { IChatMessage } from '@interfaces/domain/IChatMessage'
import { getChatMessagesApi } from '@api/chatMessages'

export function transformChatMessage(raw: IChatMessage): ChatMessageModel {
  return new ChatMessageModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchChatMessages(workspaceId: string, chatId: string) {
  const chatMessages = await getChatMessagesApi(workspaceId, chatId)

  return chatMessages.map(transformChatMessage)
}
