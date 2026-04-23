import { PaymentItemIdEnum } from '@/enums/PaymentItemIdEnum'
import { paymentKeys } from '@/keys'
import { buyCredits } from '@/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useBuyCredits() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: ({ itemId }: { itemId: PaymentItemIdEnum }) => buyCredits(itemId),
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
