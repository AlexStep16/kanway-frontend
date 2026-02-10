import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { paymentKeys } from '@/keys'
import { downgradeSubscription } from '@/services/payment'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'

export function useDowngradeSubscription() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: ({ subscriptionId }: { subscriptionId: SubscriptionPlanEnum }) =>
      downgradeSubscription(subscriptionId),
    onSuccess: (result) => {
      if (result) {
        authStore.setUser(result)
      }
    },
  })
}
