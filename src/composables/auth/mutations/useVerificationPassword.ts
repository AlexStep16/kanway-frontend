import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { verifyPasswordToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationPassword() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: async ({ token }: { token: string }) => {
      const result = await verifyPasswordToken(token)
      await navigate(`/auth/${AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE}`)
      return result
    },
  })
}
