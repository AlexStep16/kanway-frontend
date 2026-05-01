import { verifyLoginToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationLogin() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token }: { token: string }) => verifyLoginToken(token),
    onSuccess: () => {
      navigate('/workspace')
    },
  })
}
