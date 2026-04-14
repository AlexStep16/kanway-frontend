import { chatKeys } from '@/keys'
import { stopAgent } from '@/services/chat'
import { useAgentStatusStore } from '@/stores/agentStatus'
import { useMutation } from '@tanstack/vue-query'

export interface StopAgentVars {
  chatId: string
  jobId: string
}

export function useStopAgent() {
  const agentStatusStore = useAgentStatusStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'stopAgent'],

    mutationFn: (vars: StopAgentVars) => {
      agentStatusStore.isStopped = true

      return stopAgent({
        jobId: vars.jobId,
      })
    },
  })
}
