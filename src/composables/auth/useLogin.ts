import LoginCredentials from '@/interfaces/LoginCredentials'
import { login } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'

export function useLogin() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (user) => {
      authStore.setUser(user)
    },
  })
}
