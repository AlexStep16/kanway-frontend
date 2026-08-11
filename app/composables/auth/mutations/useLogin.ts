import type LoginCredentials from '~/interfaces/LoginCredentials'
import { login } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'login'],
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
