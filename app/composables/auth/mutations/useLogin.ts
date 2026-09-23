import type LoginCredentials from '~/interfaces/LoginCredentials'
import { login } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { IUser } from '~/interfaces/domain/IUser'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'login'],
    meta: {
      errorMessage: false,
    },
    mutationFn: (credentials: LoginCredentials) => login(credentials),

    onSuccess: (user: IUser) => {
      queryClient.setQueryData(userKeys.me, user)
    },
  })
}
