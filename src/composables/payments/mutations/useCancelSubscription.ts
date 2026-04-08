import { paymentKeys, userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { cancelSubscription } from '@/services/payment'
import { useMutation } from '@tanstack/vue-query'

export function useCancelSubscription() {
  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => cancelSubscription(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
