import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import { retryAgent } from '~/services/chat'
import { useChatStore } from '~/stores/chat'
import { useAgentStatusStore } from '~/stores/agentStatus'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface RetryAgentVars {
  payload: {
    chatMessageId: string
    chatId: string
    threadId: string
    boardId: string
    workspaceId: string
  }
  chatId: string
}

export function useRetryAgent() {
  const agentStatusStore = useAgentStatusStore()
  const queryClient = useQueryClient()
  const chatStore = useChatStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveTool'],

    mutationFn: async ({ payload }: RetryAgentVars) => {
      const jobId = window.crypto.randomUUID()

      agentStatusStore.connectSSE(jobId)

      return retryAgent({
        chatId: payload.chatId,
        threadId: payload.threadId,
        modelType: chatStore.modelType,
        boardId: payload.boardId,
        workspaceId: payload.workspaceId,
        timezone: dayjs.tz.guess(),
        jobId,
      })
    },

    onSuccess: (result, { chatId, payload }) => {
      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(chatId),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages
            ? oldChatMessages.filter((c) => c.id !== payload.chatMessageId)
            : []
        },
      )
    },
  })
}
