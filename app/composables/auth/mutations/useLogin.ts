import type LoginCredentials from '~/interfaces/LoginCredentials'
import { login } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'login'],
    meta: {
      errorMessage: false,
    },
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      navigateTo('/workspace')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
