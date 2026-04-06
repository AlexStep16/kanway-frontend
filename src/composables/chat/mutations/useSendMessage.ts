import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { sendMessage as sendMessageApi } from '@services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useChatStore } from '@/stores/chat'
import dayjs from 'dayjs'
import { chatKeys, chatMessageKeys } from '@/keys'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { useAuthStore } from '@/stores/auth'

interface SendMessageVars {
  payload: {
    message: string
    boardId: string | null
    workspaceId: string | null
    threadId?: string
  }
  chatId: string
}

export function useSendMessage() {
  const authStore = useAuthStore()
  const agentStore = useAgentStatusStore()
  const chatStore = useChatStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'sendMessage'],

    onMutate: ({ payload, chatId }: SendMessageVars) => {
      if (!authStore.user) return

      const chatMessageKey = chatMessageKeys.byChat(chatId)

      const userMessage: IChatMessage = {
        id: crypto.randomUUID(),
        chatId,
        threadId: payload.threadId || '',
        content: payload.message,
        role: 'user',
        userId: authStore.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const stepMessage: IChatMessage = {
        id: crypto.randomUUID(),
        chatId,
        threadId: payload.threadId || '',
        content: [],
        role: 'steps',
        userId: authStore.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (chatStore.temporaryChatId === chatId) {
        queryClient.setQueryData(chatMessageKey, [userMessage, stepMessage])
      } else {
        queryClient.setQueryData<IChatMessage[]>(chatMessageKey, (oldMessages) => {
          const newMessages = oldMessages
            ? [...oldMessages, userMessage, stepMessage]
            : [userMessage, stepMessage]

          return newMessages
        })
      }

      return { userMessage, stepMessage, originalChatId: chatId }
    },

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

    onSuccess: (result, _v, context) => {
      const realChatId = result.chat.id
      const originalChatId = context?.originalChatId

      if (originalChatId && originalChatId !== realChatId) {
        const optimisticData = queryClient.getQueryData(chatMessageKeys.byChat(originalChatId))
        queryClient.setQueryData(chatMessageKeys.byChat(realChatId), optimisticData)
        queryClient.removeQueries({ queryKey: chatMessageKeys.byChat(originalChatId) })
      }

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(realChatId),
        (oldChatMessages) => {
          if (!oldChatMessages || !context) return oldChatMessages

          const { userMessage, stepMessage } = context

          return oldChatMessages.map((message) => {
            if (message.id === userMessage.id) return { ...result.userMessage }
            if (message.id === stepMessage.id) return { ...result.stepMessage }
            return message
          })
        },
      )

      chatStore.selectChat(result.chat)

      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(result.chat.workspaceId) })
    },

    onError: () => {
      agentStore.closeSSE()
    },
  })
}
