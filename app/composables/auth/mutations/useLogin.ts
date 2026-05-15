import type LoginCredentials from '~/interfaces/LoginCredentials'
import { login } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogin() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  
  return useMutation({
    mutationKey: ['user', 'login'],
    meta: {
      errorMessage: false,
    },
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      authStore.setAuthenticated(data)

      navigateTo('/workspace')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
