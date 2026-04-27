import LoginCredentials from '@/interfaces/LoginCredentials'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { login } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useLogin() {
  return useMutation({
    mutationKey: ['user', 'login'],
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      navigate('/workspace')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
