import { validateRecoveryToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useValidateRecoveryToken() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token }: { token: string }) => validateRecoveryToken(token),
  })
}
