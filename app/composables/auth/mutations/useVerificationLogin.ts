import { verifyLoginToken } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationLogin() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token }: { token: string }) => verifyLoginToken(token),
    onSuccess: () => {
      navigateTo('/workspace')
    },
  })
}
