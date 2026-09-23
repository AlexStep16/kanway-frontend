import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { buySubscription } from '~/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useBuySubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: ({ subscriptionId }: { subscriptionId: SubscriptionPlanEnum }) =>
      buySubscription(subscriptionId),
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
