import type { IChat } from '~/interfaces/domain/IChat'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import ChatModel from '~/models/ChatModel'
import type { SendMessagePayload } from '~/interfaces/SendMessagePayload'
import type { IApproveToolPayload } from '~/interfaces/IApproveToolPayload'
import type { RetryAgentPayload } from '~/interfaces/RetryAgentPayload'
import type { StopAgentPayload } from '~/interfaces/StopAgentPayload'
import type { IChatEditPayload } from '~/interfaces/IChatEditPayload'
import type { UpdateChatNamePayload } from '~/interfaces/UpdateChatNamePayload'
import dayjs from 'dayjs'
import type { IUser } from '~/interfaces/domain/IUser'

export function transformChat(raw: IChat): ChatModel {
  const { $queryClient } = useNuxtApp()

  const user = $queryClient.getQueryData<IUser>(userKeys.me)

  const timezone = user?.timezone || dayjs.tz.guess()

  return new ChatModel({
    ...raw,
    createdAt: dayjs.utc(raw.createdAt).tz(timezone).toDate(),
    updatedAt: dayjs.utc(raw.updatedAt).tz(timezone).toDate(),
  })
}

export async function updateChat(payload: IChatEditPayload, id: string) {
  const result = await patchChatApi(payload, id)

  return result.map(transformChat).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export async function sendMessage(payload: SendMessagePayload, signal?: AbortSignal) {
  const result = await sendMessageApi(payload, signal)

  return result
}

export async function updateChatName(payload: UpdateChatNamePayload) {
  const result = await updateChatNameApi(payload)

  return result
}

export async function retryAgent(data: RetryAgentPayload) {
  const result = await retryApi(data)

  return result
}

export async function fetchChats(workspaceId?: string) {
  const chats = await getChatsApi(workspaceId)

  return chats.map(transformChat).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export async function fetchChat(id: string) {
  const chats = await getChatApi(id)
  const chat = chats.length > 0 ? chats[0] : null

  return chat ? transformChat(chat) : null
}

export async function removeChat(id: string) {
  await deleteChatApi(id)
}

export async function approveToolCall(data: IApproveToolPayload) {
  return await approveToolCallApi(data)
}

export async function cloneChat(id: string): Promise<IResponseWithLog<IChat>> {
  const cloneResult = await cloneChatApi(id)

  return {
    data: transformChat(cloneResult.data),
    logId: cloneResult.logId,
  }
}

export async function stopAgent(data: StopAgentPayload) {
  return await stopAgentApi(data)
}
