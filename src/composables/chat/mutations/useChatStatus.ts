import { chatKeys } from '@/keys'
import { useIsMutating, useMutationState } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useChatStatus() {
  const isSending = useIsMutating({ mutationKey: [...chatKeys.all, 'sendMessage'] })
  const isStopping = useIsMutating({ mutationKey: [...chatKeys.all, 'stopAgent'] })

  // Для конкретного тула (Approve)
  const isApproving = (toolId: string) =>
    useMutationState({
      filters: {
        status: 'pending',
        predicate: (m) => (m.state.variables as any)?.toolCallId === toolId,
      },
    })

  return {
    isMessageSending: computed(() => isSending.value > 0),
    isAgentStopping: computed(() => isStopping.value > 0),
    isToolApproving: (id: string) => computed(() => isApproving(id).value.length > 0),
  }
}
