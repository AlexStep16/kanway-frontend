import { verifyEmailToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationEmail() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token }: { token: string }) => verifyEmailToken(token),
  })
}
