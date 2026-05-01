import { verifyEmailToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationEmail() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ token }: { token: string }) => verifyEmailToken(token),
    onSuccess: () => {
      navigate('/workspace')
    },
  })
}
