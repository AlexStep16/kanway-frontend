import { verifyEmailOTP } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationEmailOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code, email }: { code: string; email: string }) => verifyEmailOTP(code, email),
    onSuccess: () => {
      navigateTo('/workspace')
    },
  })
}
