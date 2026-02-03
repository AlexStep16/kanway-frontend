import LoginCredentials from '@/interfaces/LoginCredentials'
import { login } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useLogin() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: ['user', 'login'],
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (user) => {
      authStore.setUser(user)
      navigate('/workspace')
    },
  })
}
