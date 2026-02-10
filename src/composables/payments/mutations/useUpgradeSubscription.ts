import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { paymentKeys } from '@/keys'
import { upgradeSubscription } from '@/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useUpgradeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: ({ subscriptionId }: { subscriptionId: SubscriptionPlanEnum }) =>
      upgradeSubscription(subscriptionId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() })

      if (result.payment) {
        if (result.payment.confirmation && result.payment.confirmation.confirmation_url) {
          window.location.href = result.payment.confirmation.confirmation_url
        }
      }
    },
  })
}
