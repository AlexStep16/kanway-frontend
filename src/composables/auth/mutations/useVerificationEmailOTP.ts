import { verifyEmailOTP } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationEmailOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ code }: { code: string }) => {
      const result = await verifyEmailOTP(code)
      await navigate('/workspace')
      return result
    },
  })
}
