import { verifyLoginOTP } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationLoginOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code, email }: { code: string; email: string }) => verifyLoginOTP(code, email),
    onSuccess: () => {
      navigateTo('/workspace')
    },
  })
}
