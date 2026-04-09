import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { sendMessage as sendMessageApi, stopAgent } from '@services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useChatStore } from '@/stores/chat'
import dayjs from 'dayjs'
import { chatKeys, chatMessageKeys, userKeys } from '@/keys'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { IUser } from '@/interfaces/domain/IUser'

interface SendMessageVars {
  payload: {
    message: string
    boardId: string | null
    workspaceId: string | null
    threadId?: string
  }
  chatId: string
  signal?: AbortSignal
}

export function useSendMessage() {
  const agentStatusStore = useAgentStatusStore()
  const chatStore = useChatStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'sendMessage'],

    onMutate: ({ payload, chatId }: SendMessageVars) => {
      const user = queryClient.getQueryData<IUser>(userKeys.me)
      if (!user) return

      const chatMessageKey = chatMessageKeys.byChat(chatId)

      const userMessage: IChatMessage = {
        id: crypto.randomUUID(),
        chatId,
        threadId: payload.threadId || '',
        content: payload.message,
        role: 'user',
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (chatStore.temporaryChatId === chatId) {
        queryClient.setQueryData(chatMessageKey, [userMessage])
      } else {
        queryClient.setQueryData<IChatMessage[]>(chatMessageKey, (oldMessages) => {
          const newMessages = oldMessages ? [...oldMessages, userMessage] : [userMessage]

          return newMessages
        })
      }

      return { userMessage, originalChatId: chatId }
    },

    mutationFn: ({ payload, signal }: SendMessageVars) => {
      if (!payload.workspaceId) {
        throw new Error('Нет активного пространства')
      }

      const jobId = crypto.randomUUID()

      agentStatusStore.connectSSE(jobId)

      return sendMessageApi(
        {
          message: payload.message,
          jobId,
          boardId: payload.boardId || undefined,
          threadId: payload.threadId,
          timezone: dayjs.tz.guess(),
          workspaceId: payload.workspaceId,
        },
        signal,
      )
    },

    onSuccess: (result, _v, context) => {
      const originalChatId = context?.originalChatId
      const realChatId = result.chat.id

      const userMessage = context?.userMessage

      chatStore.activeChatId = realChatId

      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(result.chat.workspaceId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.detailed(realChatId) })

      if (originalChatId && chatStore.temporaryChatId === originalChatId) {
        queryClient.setQueryData<IChatMessage[]>(chatMessageKeys.byChat(originalChatId), () => [])
      }

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(realChatId),
        (oldMessages) => {
          return oldMessages ? oldMessages.filter((msg) => msg.id !== userMessage?.id) : []
        },
      )
    },

    onError: (error, _v, context) => {
      agentStatusStore.closeSSE()

      const originalChatId = context?.originalChatId
      const userMessage = context?.userMessage

      if (originalChatId && chatStore.temporaryChatId === originalChatId) {
        queryClient.setQueryData<IChatMessage[]>(chatMessageKeys.byChat(originalChatId), () => [])
      } else if (originalChatId) {
        queryClient.setQueryData<IChatMessage[]>(
          chatMessageKeys.byChat(originalChatId),
          (oldMessages) => {
            return oldMessages ? oldMessages.filter((msg) => msg.id !== userMessage?.id) : []
          },
        )
      }
    },
  })
}
