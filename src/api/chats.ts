import { apiCall } from '@/apiClient'
import { IChat } from '@interfaces/domain/IChat'
import { IResponseWithLog } from '@interfaces/IResponseWithLog'
import { SendMessagePayload } from '@interfaces/SendMessagePayload'
import { SendMessageResponse } from '@interfaces/SendMessageResponse'
import { IApproveEntityActionToolCallPayload } from '@interfaces/IApproveEntityActionToolCallPayload'
import { IChatMessage } from '@interfaces/domain/IChatMessage'
import { RetryAgentPayload } from '@interfaces/RetryAgentPayload'
import { StopAgentPayload } from '@interfaces/StopAgentPayload'
import { ResolveAmbiguous } from '@/interfaces/ResolveAmbiguous'

export async function getChatsApi(workspaceId?: string) {
  const queryParams = workspaceId ? `?workspaceId=${workspaceId}` : ''

  return await apiCall<IChat[]>({
    method: 'GET',
    url: `/chats${queryParams}`,
  })
}

export async function getChatApi(id: string) {
  return await apiCall<IChat[]>({
    method: 'GET',
    url: `/chats/${id}`,
  })
}

export async function sendMessageApi(data: SendMessagePayload) {
  return await apiCall<SendMessageResponse>({
    method: 'POST',
    url: `/chats/send`,
    data,
  })
}

export async function retryApi(data: RetryAgentPayload) {
  return await apiCall<{ jobId: string }>({
    method: 'POST',
    url: `/chats/retry`,
    data,
  })
}

export async function deleteChatApi(id: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/chats/${id}`,
  })
}

export async function cloneChatApi(id: string) {
  return await apiCall<IResponseWithLog<IChat>>({
    method: 'POST',
    url: `/chats/${id}/clone`,
  })
}

export async function approveToolCallApi(data: IApproveEntityActionToolCallPayload) {
  return await apiCall<{ jobId: string | null }>({
    method: 'POST',
    url: `/chats/log/approve`,
    data,
  })
}

export async function resolveAmbiguousApi(data: ResolveAmbiguous) {
  return await apiCall<{ jobId: string | null; chatMessage: IChatMessage }>({
    method: 'POST',
    url: `/chats/tools/resolve-ambiguous`,
    data,
  })
}

export async function stopAgentApi(data: StopAgentPayload) {
  return await apiCall<void>({
    method: 'POST',
    url: `/chats/${data.jobId}/stop`,
    data: { chatId: data.chatId, threadId: data.threadId },
  })
}
