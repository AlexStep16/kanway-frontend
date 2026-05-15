import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { verifyPasswordToken } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationPassword() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: async ({ token }: { token: string }) => verifyPasswordToken(token),
    onSuccess: () => {
      navigateTo(`/auth/${AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE}`)
    },
  })
}
