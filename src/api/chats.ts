import { apiCall } from '@/apiClient'
import { IChat } from '@interfaces/domain/IChat'
import { IResponseWithLog } from '@interfaces/IResponseWithLog'
import { SendMessagePayload } from '@interfaces/SendMessagePayload'
import { SendMessageResponse } from '@interfaces/SendMessageResponse'
import { ApproveToolCall } from '@interfaces/ApproveToolCall'
import { IChatMessage } from '@interfaces/domain/IChatMessage'
import { RetryAgentPayload } from '@interfaces/RetryAgentPayload'
import { StopAgentPayload } from '@interfaces/StopAgentPayload'

export async function getChatsApi(workspaceId: string) {
  return await apiCall<IChat[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/chats`,
  })
}

export async function sendMessageApi(workspaceId: string, data: SendMessagePayload) {
  return await apiCall<SendMessageResponse>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/chats/send`,
    data,
  })
}

export async function retryApi(data: RetryAgentPayload, workspaceId: string) {
  return await apiCall<{ jobId: string }>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/chats/retry`,
    data,
  })
}

export async function deleteChatApi(chatId: string, workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}/chats/${chatId}`,
  })
}

export async function cloneChatApi(chatId: string, workspaceId: string) {
  return await apiCall<IResponseWithLog<IChat>>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/chats/${chatId}/clone`,
  })
}

export async function approveToolCallApi(data: ApproveToolCall, workspaceId: string) {
  return await apiCall<{ jobId: string | null; chatMessage: IChatMessage }>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/chats/tools/approve`,
    data,
  })
}

export async function stopAgentApi(data: StopAgentPayload, workspaceId: string) {
  return await apiCall<void>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/chats/${data.jobId}/stop`,
    data: { chatId: data.chatId, threadId: data.threadId },
  })
}
