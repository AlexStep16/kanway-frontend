import { verifyLoginOTP } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationLoginOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ code, email }: { code: string; email: string }) => {
      const result = await verifyLoginOTP(code, email)
      await navigate('/workspace')
      return result
    },
  })
}
