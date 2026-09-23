import { downgradeCancelSubscription } from '~/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useDowngradeCancelSubscription() {
  const queryClient = useQueryClient()

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
