import { IChat } from '@interfaces/domain/IChat'
import {
  getChatsApi,
  deleteChatApi,
  cloneChatApi,
  sendMessageApi,
  approveToolCallApi,
} from '@api/chats'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import ChatModel from '@/models/ChatModel'
import { SendMessagePayload } from '@/interfaces/SendMessagePayload'
import { ApproveToolCall } from '@/interfaces/ApproveToolCall'

export function transformChat(raw: IChat): ChatModel {
  return new ChatModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function sendMessage(workspaceId: string, payload: SendMessagePayload) {
  const result = sendMessageApi(workspaceId, payload)

  return result
}

export async function fetchChats(workspaceId: string) {
  const chats = await getChatsApi(workspaceId)

  return chats.map(transformChat).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export async function removeChat(chatId: string, workspaceId: string) {
  await deleteChatApi(chatId, workspaceId)
}

export async function approveToolCall(data: ApproveToolCall, workspaceId: string) {
  const result = await approveToolCallApi(data, workspaceId)

  return {
    jobId: result.jobId,
    chatMessage: result.chatMessage,
  }
}

export async function cloneChat(
  chatId: string,
  workspaceId: string,
): Promise<IResponseWithLog<IChat>> {
  const cloneResult = await cloneChatApi(chatId, workspaceId)

  return {
    data: transformChat(cloneResult.data),
    logId: cloneResult.logId,
  }
}
