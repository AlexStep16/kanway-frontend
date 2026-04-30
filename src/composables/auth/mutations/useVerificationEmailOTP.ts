import { verifyEmailOTP } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationEmailOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ code, email }: { code: string; email: string }) => {
      const result = await verifyEmailOTP(code, email)
      await navigate('/workspace')
      return result
    },
  })
}
