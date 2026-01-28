import { useQuery } from '@tanstack/vue-query'
import { paymentKeys } from '@/keys'
import { fetchPayments } from '@/services/setting'

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.all,
    queryFn: () => fetchPayments(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
