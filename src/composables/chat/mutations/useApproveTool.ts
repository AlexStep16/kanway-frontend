import { chatKeys } from '@/keys'
import { approveToolCall } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useChatMessageStore } from '@stores/chatMessage'
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface ApproveToolCallVars {
  payload: {
    toolCallId: string
    chatMessageId: string
    boardId: string
    isConfirmed: boolean
    isCancelled: boolean
    workspaceId: string
  }
}

export function useApproveTool() {
  const agentStore = useAgentStatusStore()
  const messageStore = useChatMessageStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveTool'],

    mutationFn: ({ payload }: ApproveToolCallVars) =>
      approveToolCall({
        toolCallId: payload.toolCallId,
        chatMessageId: payload.chatMessageId,
        boardId: payload.boardId,
        isConfirmed: payload.isConfirmed,
        isCancelled: payload.isCancelled,
        workspaceId: payload.workspaceId,
        timezone: dayjs.tz.guess(),
      }),

    onSuccess: (result, vars) => {
      messageStore.updateChatMessageInStore(result.chatMessage)

      if (result.jobId) {
        messageStore.deleteFromStore([vars.payload.chatMessageId])
        agentStore.connectSSE(result.jobId)
      }
    },
  })
}
