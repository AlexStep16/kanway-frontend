import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { retryAgent } from '~/services/chat'
import { useChatStore } from '~/stores/chat'
import { useAgentStatusStore } from '~/stores/agentStatus'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import dayjs from 'dayjs'

interface RetryAgentVars {
  payload: {
    chatId: string
    statusMessage: IChatMessage
    threadId: string
    boardId: string
    workspaceId: string
  }
  chatId: string
}

export function useRetryAgent() {
  const agentStatusStore = useAgentStatusStore()
  const chatStore = useChatStore()
  const queryClient = useQueryClient()

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

    onSuccess: (_result, { payload }) => {
      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(payload.chatId),
        (oldMessages = []) => {
          return oldMessages.filter(
            (message) => message.createdAt <= payload.statusMessage.createdAt,
          )
        },
      )
    },
  })
}
