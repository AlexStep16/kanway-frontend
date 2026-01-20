import { chatKeys } from '@/keys'
import { retryAgent } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useChatMessageStore } from '@stores/chatMessage'
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface RetryAgentVars {
  payload: {
    chatMessageId: string
    chatId: string
    threadId: string
    boardId: string
    workspaceId: string
  }
}

export function useRetryAgent() {
  const agentStore = useAgentStatusStore()
  const chatMessageStore = useChatMessageStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveTool'],

    mutationFn: ({ payload }: RetryAgentVars) =>
      retryAgent({
        chatId: payload.chatId,
        threadId: payload.threadId,
        boardId: payload.boardId,
        workspaceId: payload.workspaceId,
        timezone: dayjs.tz.guess(),
      }),

    onSuccess: (result, vars) => {
      chatMessageStore.removeChatMessageFromStore(vars.payload.chatMessageId)

      agentStore.connectSSE(result.jobId)
    },
  })
}
