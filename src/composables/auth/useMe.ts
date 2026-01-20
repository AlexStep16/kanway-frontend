import { useQuery } from '@tanstack/vue-query'
import { getMe } from '@services/auth'
import { useAuthStore } from '@/stores/auth'

export function useMe() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const data = await getMe()
      authStore.setUser(data)

      return data
    },
    enabled: !!localStorage.getItem('token'),
    staleTime: Infinity,
  })
}
