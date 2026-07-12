import { fetchPayment } from '~/services/payment'
import { useQuery } from '@tanstack/vue-query'

export function usePayment(id: MaybeRef<string>) {
  return useQuery({
    queryKey: paymentKeys.detailed(id),
    queryFn: () => fetchPayment(toValue(id)),
    enabled: !!toValue(id),
    staleTime: 1000 * 60 * 5,
  })
}
