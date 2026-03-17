import { OperationLogStatusesEnum } from '@/enums/OperationLogStatusesEnum'
import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { chatKeys, chatMessageKeys, logKeys } from '@/keys'
import { approveToolCall } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

interface ApproveLogVars {
  payload: {
    id: string
    selectedIds: string[]
    isConfirmed: boolean
  }
  boardId: string | null
  workspaceId: string | null
  message: IChatMessage
}

export function useApproveLog() {
  const agentStore = useAgentStatusStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveLog'],

    mutationFn: ({ payload, boardId, workspaceId, message }: ApproveLogVars) => {
      if (payload.isConfirmed && payload.selectedIds.length === 0) {
        throw new Error(
          'Хотя бы одна сущность должна быть подтверждена. Вы можете отменить весь вызов.',
        )
      }

      if (!workspaceId) {
        throw new Error('Нет активного пространства')
      }

      const approveData = {
        id: payload.id,
        selectedIds: payload.selectedIds,
        isConfirmed: payload.isConfirmed,
        chatId: message.chatId,
        chatMessageId: message.id,
        threadId: message.threadId,
        boardId: boardId ?? undefined,
        workspaceId: workspaceId,
        timezone: dayjs.tz.guess(),
      }

      return approveToolCall(approveData)
    },

    onSuccess: (result, { message, payload }) => {
      if (result.jobId) {
        queryClient.invalidateQueries({ queryKey: logKeys.detailed(payload.id) })
        agentStore.connectSSE(result.jobId)
      }
    },
  })
}
