import ChatMessageModel from '~/models/ChatMessageModel'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { RateMessagePayload } from '~/interfaces/RateMessagePayload'
import dayjs from 'dayjs'
import type { IUser } from '~/interfaces/domain/IUser'

export function transformChatMessage(raw: IChatMessage): ChatMessageModel {
  const { $queryClient } = useNuxtApp()

  const user = $queryClient.getQueryData<IUser>(userKeys.me)

  const timezone = user?.timezone || dayjs.tz.guess()

  return new ChatMessageModel({
    ...raw,
    createdAt: dayjs.utc(raw.createdAt).tz(timezone).toDate(),
    updatedAt: dayjs.utc(raw.updatedAt).tz(timezone).toDate(),
  })
}

export async function fetchChatMessages(chatId: string) {
  const chatMessages = await getChatMessagesApi(chatId)

  return chatMessages.map(transformChatMessage)
}

export async function rateChatMessage(data: RateMessagePayload, id: string) {
  const chatMessage = await rateChatMessageApi(data, id)

  return transformChatMessage(chatMessage)
}
