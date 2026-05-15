import { cancelSubscription } from '~/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useCancelSubscription() {
  const queryClient = useQueryClient()

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
