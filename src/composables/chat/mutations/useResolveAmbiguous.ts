import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { chatKeys, chatMessageKeys } from '@/keys'
import { resolveAmbiguous } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface ResolveAmbiguousVars {
  payload: {
    callId: string
    ids: string[]
  }
  chatId: string
  chatMessageId: string
  boardId: string
  workspaceId: string
}

export function useResolveAmbiguous() {
  const agentStore = useAgentStatusStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'resolveAmbiguous'],

    mutationFn: ({
      payload,
      chatId,
      chatMessageId,
      boardId,
      workspaceId,
    }: ResolveAmbiguousVars) => {
      if (payload.ids.length === 0) {
        throw new Error('Хотя бы одна сущность должна быть выбрана.')
      }

      return resolveAmbiguous({
        callId: payload.callId,
        ids: payload.ids,
        chatId,
        chatMessageId,
        boardId,
        workspaceId,
        timezone: dayjs.tz.guess(),
      })
    },

    onSuccess: (result, { chatId }) => {
      if (result.jobId) {
        queryClient.setQueryData<IChatMessage[]>(
          chatMessageKeys.byChat(chatId),
          (oldChatMessages: IChatMessage[] | undefined) => {
            return oldChatMessages
              ? oldChatMessages.filter((c) => c.id !== result.chatMessage.id)
              : []
          },
        )
        agentStore.connectSSE(result.jobId)
      }
    },
  })
}
