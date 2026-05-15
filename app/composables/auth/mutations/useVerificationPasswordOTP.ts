import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { verifyPasswordOTP } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useVerificationPasswordOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code, email }: { code: string; email: string }) =>
      verifyPasswordOTP(code, email),
    onSuccess: () => {
      navigateTo(`/auth/${AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE}`)
    },
  })
}
