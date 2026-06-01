import { approveToolCall } from '~/services/chat'
import { useAgentStatusStore } from '~/stores/agentStatus'
import { useChatStore } from '~/stores/chat'
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface ApproveToolVars {
  payload: {
    toolId: string
    chatId: string
    threadId: string
    statusLogId: string
    isConfirmed: boolean
    isRejected: boolean
  }
  boardId: string | null
  workspaceId: string | null
}

export function useApproveTool() {
  const agentStatusStore = useAgentStatusStore()
  const chatStore = useChatStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveTool'],

    mutationFn: async ({ payload, boardId, workspaceId }: ApproveToolVars) => {
      if (!workspaceId) {
        throw new Error('Нет активного пространства')
      }

      const jobId = window.crypto.randomUUID()

      agentStatusStore.connectSSE(jobId)

      const approveData = {
        toolId: payload.toolId,
        isConfirmed: payload.isConfirmed,
        isRejected: payload.isRejected,
        chatId: payload.chatId,
        modelType: chatStore.modelType,
        jobId,
        threadId: payload.threadId,
        boardId: boardId ?? undefined,
        workspaceId: workspaceId,
        timezone: dayjs.tz.guess(),
        statusLogId: payload.statusLogId,
      }

      return approveToolCall(approveData)
    },
  })
}
