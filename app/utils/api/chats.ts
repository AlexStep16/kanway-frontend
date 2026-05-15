import type { IChat } from '~/interfaces/domain/IChat'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import type { SendMessagePayload } from '~/interfaces/SendMessagePayload'
import type { SendMessageResponse } from '~/interfaces/SendMessageResponse'
import type { IApproveEntityActionToolCallPayload } from '~/interfaces/IApproveEntityActionToolCallPayload'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { RetryAgentPayload } from '~/interfaces/RetryAgentPayload'
import type { StopAgentPayload } from '~/interfaces/StopAgentPayload'
import type { ResolveAmbiguous } from '~/interfaces/ResolveAmbiguous'
import type { IChatEditPayload } from '~/interfaces/IChatEditPayload'

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

export async function sendMessageApi(data: SendMessagePayload, signal?: AbortSignal) {
  return await apiCall<SendMessageResponse>({
    method: 'POST',
    url: `/chats/send`,
    data,
    signal,
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
    data: { jobId: data.jobId },
  })
}

export async function patchChatApi(payload: IChatEditPayload, id: string) {
  return apiCall<IChat[]>({
    method: 'PATCH',
    url: `/chats/${id}`,
    data: payload,
  })
}
