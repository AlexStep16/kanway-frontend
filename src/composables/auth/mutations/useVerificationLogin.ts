import { verifyLoginToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationLogin() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: async ({ token }: { token: string }) => {
      const result = await verifyLoginToken(token)
      await navigate('/workspace')
      return result
    },
  })
}
