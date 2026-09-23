import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { downgradeSubscription } from '~/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useDowngradeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: ({ subscriptionId }: { subscriptionId: SubscriptionPlanEnum }) =>
      downgradeSubscription(subscriptionId),
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({
          queryKey: userKeys.me,
        })
      }
    },
  })
}
