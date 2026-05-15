import { useQuery } from '@tanstack/vue-query'
import { getMe } from '~/services/auth'

export function useUser() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () => getMe(),
    staleTime: Infinity,
  })
}
