import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import { approveToolCall } from '~/services/chat'
import { useAgentStatusStore } from '~/stores/agentStatus'
import { useChatStore } from '~/stores/chat'
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
  const queryClient = useQueryClient()
  const agentStatusStore = useAgentStatusStore()
  const chatStore = useChatStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'approveLog'],

    mutationFn: async ({ payload, boardId, workspaceId, message }: ApproveLogVars) => {
      if (payload.isConfirmed && payload.selectedIds.length === 0) {
        throw new Error(
          'Хотя бы одна сущность должна быть подтверждена. Вы можете отменить весь вызов.',
        )
      }

      if (!workspaceId) {
        throw new Error('Нет активного пространства')
      }

      const jobId = crypto.randomUUID()

      agentStatusStore.connectSSE(jobId)

      const approveData = {
        id: payload.id,
        selectedIds: payload.selectedIds,
        isConfirmed: payload.isConfirmed,
        chatId: message.chatId,
        modelType: chatStore.modelType,
        jobId,
        chatMessageId: message.id,
        threadId: message.threadId,
        boardId: boardId ?? undefined,
        workspaceId: workspaceId,
        timezone: dayjs.tz.guess(),
      }

      return approveToolCall(approveData)
    },

    onSuccess: (result, { payload }) => {
      queryClient.invalidateQueries({ queryKey: logKeys.detailed(payload.id) })
    },
  })
}
