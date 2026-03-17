import { IChat } from '@interfaces/domain/IChat'
import {
  getChatsApi,
  deleteChatApi,
  cloneChatApi,
  sendMessageApi,
  approveToolCallApi,
  resolveAmbiguousApi,
  retryApi,
  stopAgentApi,
  getChatApi,
} from '@api/chats'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import ChatModel from '@/models/ChatModel'
import { SendMessagePayload } from '@/interfaces/SendMessagePayload'
import { IApproveEntityActionToolCallPayload } from '@/interfaces/IApproveEntityActionToolCallPayload'
import { RetryAgentPayload } from '@/interfaces/RetryAgentPayload'
import { StopAgentPayload } from '@/interfaces/StopAgentPayload'
import { ResolveAmbiguous } from '@/interfaces/ResolveAmbiguous'

export function transformChat(raw: IChat): ChatModel {
  return new ChatModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function sendMessage(payload: SendMessagePayload) {
  const result = await sendMessageApi(payload)

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

export async function approveToolCall(data: IApproveEntityActionToolCallPayload) {
  return await approveToolCallApi(data)
}

export async function resolveAmbiguous(data: ResolveAmbiguous) {
  const result = await resolveAmbiguousApi(data)

  return {
    jobId: result.jobId,
    chatMessage: result.chatMessage,
  }
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
