import { verifyEmailOTP } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code }: { code: string }) => verifyEmailOTP(code),
  })
}
