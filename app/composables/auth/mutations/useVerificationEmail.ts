import { verifyEmailToken } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationEmail() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ token }: { token: string }) => verifyEmailToken(token),
    onSuccess: () => {
      navigateTo('/workspace')
    },
  })
}
