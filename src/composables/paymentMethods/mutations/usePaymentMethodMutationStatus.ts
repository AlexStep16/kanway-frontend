import { paymentMethodKeys } from '@/keys'
import { useMutationState } from '@tanstack/vue-query'
import { computed, type MaybeRef, toValue } from 'vue'

export function usePaymentMethodMutationStatus(id: MaybeRef<string | null>) {
  if (!toValue(id))
    return {
      isDeleting: computed(() => false),
      isUpdating: computed(() => false),
    }

  const pendingTaskMutations = useMutationState({
    filters: {
      status: 'pending',
      predicate: (mutation) => {
        const key = mutation.options.mutationKey as string[]
        return key?.includes(paymentMethodKeys.all[0])
      },
    },
    select: (mutation) => ({
      key: mutation.options.mutationKey as string[],
      variables: mutation.state.variables as any,
    }),
  })

  const checkStatus = (
    action: string,
    type: 'paymentMethod' | 'payload' | 'array' = 'paymentMethod',
  ) => {
    return computed(() => {
      return pendingTaskMutations.value.some((m) => {
        if (!m.key.includes(action)) return false

        const v = m.variables
        if (type === 'paymentMethod') return v?.paymentMethod?.id === toValue(id)
        if (type === 'payload') return v?.payload?.id === toValue(id)
        if (type === 'array') return v?.payload?.some((p: any) => p.id === toValue(id))
        return false
      })
    })
  }

  const isDeleting = checkStatus('delete')
  const isUpdating = checkStatus('update', 'payload')

  const isBusy = computed(() => isDeleting.value || isUpdating.value)

  return {
    isDeleting,
    isUpdating,
    isBusy,
  }
}
