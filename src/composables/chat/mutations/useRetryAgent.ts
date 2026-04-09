import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { chatKeys, chatMessageKeys } from '@/keys'
import { retryAgent } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
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
  const agentStore = useAgentStatusStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveTool'],

    mutationFn: ({ payload }: RetryAgentVars) => {
      const jobId = crypto.randomUUID()

      agentStore.connectSSE(jobId)

      return retryAgent({
        chatId: payload.chatId,
        threadId: payload.threadId,
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

      agentStore.connectSSE(result.jobId)
    },
  })
}
