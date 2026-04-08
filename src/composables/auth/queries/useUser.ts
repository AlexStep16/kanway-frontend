import { useQuery } from '@tanstack/vue-query'
import { userKeys } from '@/keys'
import { getMe } from '@/services/auth'

export function useUser() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () => getMe(),
    staleTime: Infinity,
  })
}
