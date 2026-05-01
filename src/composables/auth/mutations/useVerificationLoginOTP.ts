import { verifyLoginOTP } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationLoginOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code, email }: { code: string; email: string }) => verifyLoginOTP(code, email),
    onSuccess: () => {
      navigate('/workspace')
    },
  })
}
