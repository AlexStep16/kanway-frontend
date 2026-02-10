import { paymentKeys } from '@/keys'
import { cancelSubscription } from '@/services/payment'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'

export function useCancelSubscription() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => cancelSubscription(),
    onSuccess: (result) => {
      authStore.setUser(result)
    },
  })
}
