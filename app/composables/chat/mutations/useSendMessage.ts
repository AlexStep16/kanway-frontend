import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { sendMessage } from '~/services/chat'
import { updateChatName } from '~/services/chat'
import { useAgentStatusStore } from '~/stores/agentStatus'
import { useChatStore } from '~/stores/chat'
import dayjs from 'dayjs'
import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { IUser } from '~/interfaces/domain/IUser'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { toast } from 'vue-sonner'

interface SendMessageVars {
  payload: {
    message: string
    modelType: ModelsEnum
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
        id: window.crypto.randomUUID(),
        chatId,
        threadId: payload.threadId || '',
        content: payload.message,
        role: 'user',
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      queryClient.setQueryData<IChatMessage[]>(chatMessageKey, (oldMessages) => {
        const newMessages = oldMessages ? [...oldMessages, userMessage] : [userMessage]

        return newMessages
      })

      return { userMessage, originalChatId: chatId }
    },

    mutationFn: async ({ payload, signal }: SendMessageVars) => {
      if (!payload.workspaceId) {
        throw new Error('Нет активного пространства')
      }

      const jobId = window.crypto.randomUUID()

      agentStatusStore.connectSSE(jobId)

      return sendMessage(
        {
          message: payload.message,
          modelType: payload.modelType,
          jobId,
          boardId: payload.boardId || undefined,
          threadId: payload.threadId,
          timezone: dayjs.tz.guess(),
          workspaceId: payload.workspaceId,
        },
        signal,
      )
    },

    onSuccess: (result, vars, context) => {
      const realChatId = result.chat.id
      const originalChatId = context?.originalChatId
      const optimisticUserMessage = context?.userMessage

      chatStore.activeChatId = realChatId

      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(result.chat.workspaceId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.detailed(result.chat.id) })

      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(realChatId),
        (oldMessages = []) => {
          const filtered = oldMessages.filter((msg) => msg.id !== optimisticUserMessage?.id)

          const updated = [...filtered, result.userMessage, result.statusMessage]

          return updated.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
        },
      )

      if (originalChatId && originalChatId !== realChatId) {
        queryClient.removeQueries({ queryKey: chatMessageKeys.byChat(originalChatId) })
      }

      if (!vars.payload.threadId) {
        chatStore.startRenamingChat(realChatId)

        updateChatName({
          userMessage: vars.payload.message,
          chatId: realChatId,
        })
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: chatKeys.byWorkspace(result.chat.workspaceId),
            })
            queryClient.invalidateQueries({ queryKey: chatKeys.detailed(result.chat.id) })
          })
          .catch(() => {
            toast.error('Не удалось обновить название чата')
          })
          .finally(() => {
            chatStore.stopRenamingChat(realChatId)
          })
      }
    },

    onError: (error, _v, context) => {
      agentStatusStore.closeSSE()

      const originalChatId = context?.originalChatId
      const optimisticUserMessage = context?.userMessage

      if (originalChatId) {
        queryClient.setQueryData<IChatMessage[]>(
          chatMessageKeys.byChat(originalChatId),
          (oldMessages = []) => {
            return oldMessages.filter((msg) => msg.id !== optimisticUserMessage?.id)
          },
        )

        chatStore.aiInputMessage = optimisticUserMessage?.content || ''
      }
    },
  })
}
