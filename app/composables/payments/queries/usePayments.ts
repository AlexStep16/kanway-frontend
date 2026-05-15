import { useQuery } from '@tanstack/vue-query'
import { fetchPayments } from '~/services/setting'

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.list(),
    queryFn: () => fetchPayments(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
