import { useQuery } from '@tanstack/vue-query'
import { fetchPaymentMethods } from '~/services/setting'

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.all,
    queryFn: () => fetchPaymentMethods(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
