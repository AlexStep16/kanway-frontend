import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { paymentKeys, userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { downgradeSubscription } from '@/services/payment'
import { useMutation } from '@tanstack/vue-query'

export function useDowngradeSubscription() {
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
