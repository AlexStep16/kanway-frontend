import { chatKeys } from '@/keys'
import { stopAgent } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useMutation } from '@tanstack/vue-query'

export interface StopAgentVars {
  chatId: string
  threadId: string
}

export function useStopAgent() {
  const agentStore = useAgentStatusStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'stopAgent'],

    mutationFn: (vars: StopAgentVars) =>
      stopAgent({
        chatId: vars.chatId,
        threadId: vars.threadId,
        jobId: agentStore.activeJobId || '',
      }),

    onSuccess: () => {
      agentStore.closeSSE()
    },
  })
}
