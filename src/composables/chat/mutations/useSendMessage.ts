import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { sendMessage as sendMessageApi } from '@services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useChatStore } from '@/stores/chat'
import dayjs from 'dayjs'
import { chatKeys, chatMessageKeys } from '@/keys'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'

interface SendMessageVars {
  payload: {
    message: string
    boardId: string | null
    workspaceId: string | null
    threadId?: string
  }
  chatId?: string
}

export function useSendMessage() {
  const agentStore = useAgentStatusStore()
  const chatStore = useChatStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'sendMessage'],

    mutationFn: ({ payload }: SendMessageVars) => {
      if (!payload.workspaceId) {
        throw new Error('Нет активного пространства')
      }

      const jobId = crypto.randomUUID()

      agentStore.connectSSE(jobId)

      return sendMessageApi({
        message: payload.message,
        jobId,
        boardId: payload.boardId ?? undefined,
        threadId: payload.threadId,
        timezone: dayjs.tz.guess(),
        workspaceId: payload.workspaceId,
      })
    },

    onSuccess: (result) => {
      chatStore.selectChat(result.chat)

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(result.chat.id),
        (oldChatMessages: IChatMessage[] | undefined) => {
          return oldChatMessages ? [...oldChatMessages, ...result.chatMessages] : []
        },
      )
      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(result.chat.workspaceId) })

      if (!chatStore.activeChat || chatStore.activeChat.id !== result.chat.id) {
        chatStore.selectChat(result.chat, true)
      }
    },
    onError: () => {
      agentStore.closeSSE()
    },
  })
}
