import { paymentKeys } from '@/keys'
import { downgradeCancelSubscription } from '@/services/payment'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'

export function useDowngradeCancelSubscription() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => downgradeCancelSubscription(),
    onSuccess: (result) => {
      if (result) {
        authStore.setUser(result)
      }
    },
  })
}
