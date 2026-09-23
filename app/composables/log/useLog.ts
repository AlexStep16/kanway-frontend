import { useQuery } from '@tanstack/vue-query'
import { fetchLog } from '~/services/log'

export function useLog(id: MaybeRef<string>) {
  return useQuery({
    queryKey: logKeys.detailed(id),
    queryFn: () => fetchLog(toValue(id)),
    enabled: !!toValue(id),
    staleTime: Infinity,
  })
}
