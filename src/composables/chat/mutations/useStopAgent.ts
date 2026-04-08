import { chatKeys, chatMessageKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { stopAgent } from '@/services/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { useMutation } from '@tanstack/vue-query'

export interface StopAgentVars {
  chatId: string
  jobId: string
}

export function useStopAgent() {
  const agentStore = useAgentStatusStore()

  return useMutation({
    mutationKey: [...chatKeys.all, 'stopAgent'],

    mutationFn: (vars: StopAgentVars) =>
      stopAgent({
        jobId: vars.jobId,
      }),

    onSuccess: () => {
      agentStore.closeSSE()
    },

    onSettled: (data, error, vars) => {
      queryClient.invalidateQueries({ queryKey: chatMessageKeys.byChat(vars.chatId) })
    },
  })
}
