import { useQuery } from '@tanstack/vue-query'
import { fetchSubscriptions } from '~/services/setting'

export function useSubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.all,
    queryFn: () => fetchSubscriptions(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
