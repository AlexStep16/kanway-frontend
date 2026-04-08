import { paymentKeys, userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { downgradeCancelSubscription } from '@/services/payment'
import { useMutation } from '@tanstack/vue-query'

export function useDowngradeCancelSubscription() {
  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => downgradeCancelSubscription(),
    onSuccess: (result) => {
      if (result) {
        queryClient.invalidateQueries({
          queryKey: userKeys.me,
        })
      }
    },
  })
}
