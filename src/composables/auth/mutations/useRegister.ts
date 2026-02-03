import { register } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import { navigate } from 'vike/client/router'

export function useRegister() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      register({
        ...credentials,
        timezone: dayjs.tz.guess(),
      }),
    onSuccess: (user) => {
      authStore.setUser(user)
      navigate('/workspace')
    },
  })
}
