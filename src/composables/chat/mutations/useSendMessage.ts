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
      const realChatId = result.chat.id
      const originalChatId = context?.originalChatId
      const optimisticUserMessage = context?.userMessage

      // 1. Переключаем ID активного чата
      chatStore.activeChatId = realChatId

      // 2. Инвалидируем списки чатов (чтобы обновились названия и порядок в боковой панели)
      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(result.chat.workspaceId) })
      queryClient.invalidateQueries({ queryKey: chatKeys.detailed(result.chat.id) })

      // 3. Обновляем кэш сообщений чата
      queryClient.setQueryData<IChatMessage[]>(
        chatMessageKeys.byChat(realChatId),
        (oldMessages = []) => {
          // Убираем временное (оптимистичное) сообщение
          const filtered = oldMessages.filter((msg) => msg.id !== optimisticUserMessage?.id)

          // Добавляем реальные сообщения из ответа сервера
          // Мы используем spread, чтобы гарантировать порядок: старые -> реальный User -> реальный Step
          const updated = [...filtered, result.userMessage, result.stepMessage]

          // Сортируем по дате на всякий случай, если SSE уже что-то прислал
          return updated.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
        },
      )

      // 4. Если это был новый чат (был временный ID), очищаем старый кэш
      if (originalChatId && originalChatId !== realChatId) {
        queryClient.removeQueries({ queryKey: chatMessageKeys.byChat(originalChatId) })
      }
    },

    onError: (error, _v, context) => {
      // Закрываем SSE, так как задача даже не создалась или упала сразу
      agentStatusStore.closeSSE()

      const originalChatId = context?.originalChatId
      const optimisticUserMessage = context?.userMessage

      if (originalChatId) {
        queryClient.setQueryData<IChatMessage[]>(
          chatMessageKeys.byChat(originalChatId),
          (oldMessages = []) => {
            // Здесь два варианта:
            // 1. Либо удаляем сообщение
            return oldMessages.filter((msg) => msg.id !== optimisticUserMessage?.id)

            // 2. Либо помечаем его как ошибочное
            /*
        return oldMessages.map(msg => 
          msg.id === optimisticUserMessage?.id 
            ? { ...msg, status: 'error' } 
            : msg
        )
        */
          },
        )
      }
    },
  })
}
