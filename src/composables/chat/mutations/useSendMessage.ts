import { useMutation } from '@tanstack/vue-query'
import { sendMessage as sendMessageApi } from '@services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useChatMessageStore } from '@stores/chatMessage'
import { useChatStore } from '@/stores/chat'
import dayjs from 'dayjs'
import { chatKeys } from '@/keys'

interface SendMessageVars {
  payload: {
    message: string
    boardId: string | null
    workspaceId: string | null
    threadId?: string
  }
}

export function useSendMessage() {
  const agentStore = useAgentStatusStore()
  const messageStore = useChatMessageStore()
  const chatStore = useChatStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'sendMessage'],

    mutationFn: ({ payload }: SendMessageVars) => {
      if (!payload.workspaceId) {
        throw new Error('Нет активного пространства')
      }

      return sendMessageApi({
        message: payload.message,
        boardId: payload.boardId ?? undefined,
        threadId: payload.threadId,
        timezone: dayjs.tz.guess(),
        workspaceId: payload.workspaceId,
      })
    },

    onSuccess: (result) => {
      messageStore.addChatMessages(result.chatMessages)

      if (!chatStore.activeChatId) {
        chatStore.selectChat(result.chat.id, true)
      }

      if (result.jobId) {
        agentStore.connectSSE(result.jobId)
      }
    },
  })
}
