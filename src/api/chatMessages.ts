import { apiCall } from '@/apiClient'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

export async function getChatMessagesApi(workspaceId: string, chatId: string) {
  return await apiCall<IChatMessage[]>({
    method: 'GET',
    url: `/workspaces/${workspaceId}/chat-messages/${chatId}`,
  })
}
