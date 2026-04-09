import { chatKeys } from '@/keys'
import { stopAgent } from '@/services/chat'
import { useMutation } from '@tanstack/vue-query'

export interface StopAgentVars {
  chatId: string
  jobId: string
}

export function useStopAgent() {
  return useMutation({
    mutationKey: [...chatKeys.all, 'stopAgent'],

    mutationFn: (vars: StopAgentVars) =>
      stopAgent({
        jobId: vars.jobId,
      }),
  })
}
