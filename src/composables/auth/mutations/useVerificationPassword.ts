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
    mutationFn: async ({ token }: { token: string }) => verifyPasswordToken(token),
    onSuccess: () => {
      navigate(`/auth/${AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE}`)
    },
  })
}
