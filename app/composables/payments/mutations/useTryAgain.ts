import { tryAgain } from '~/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useTryAgain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: ({ paymentId }: { paymentId: string }) => tryAgain(paymentId),
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
