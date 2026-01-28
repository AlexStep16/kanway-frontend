import { findAllSelections } from '@/helpers/findAllSelections'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { IToolApproveMessage } from '@/interfaces/IToolApproveMessage'
import { chatKeys, chatMessageKeys } from '@/keys'
import { approveToolCall } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface ApproveToolCallVars {
  payload: {
    toolCallId: string
    chatMessageId: string
    content: any
    boardId: string
    isConfirmed: boolean
    isCancelled: boolean
    workspaceId: string
  }
  chatId: string
  message: IToolApproveMessage
}

export function useApproveTool() {
  const agentStore = useAgentStatusStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveTool'],

    mutationFn: ({ payload }: ApproveToolCallVars) => {
      const declinedEntities = findAllSelections(payload.content)
      const declinedEntityIds =
        declinedEntities?.filter((e) => e.isSelected === false).map((e) => e.id || '') || []

      if (declinedEntityIds.length === declinedEntities.length && !payload.isCancelled) {
        throw new Error(
          'Хотя бы одна сущность должна быть подтверждена. Вы можете отменить весь вызов.',
        )
      }

      const approveData = {
        toolCallId: payload.toolCallId,
        chatMessageId: payload.chatMessageId,
        boardId: payload.boardId,
        isConfirmed: payload.isConfirmed,
        isCancelled: payload.isCancelled,
        workspaceId: payload.workspaceId,
        cancelledEntityIds: declinedEntityIds,
        timezone: dayjs.tz.guess(),
      }

      return approveToolCall(approveData)
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
