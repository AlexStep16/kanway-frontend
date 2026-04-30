import { AllowedAuthStepsEnum } from '@/enums/AllowedAuthStepsEnum'
import { verifyPasswordOTP } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function useVerificationPasswordOTP() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ code, email }: { code: string; email: string }) => {
      const result = await verifyPasswordOTP(code, email)
      await navigate(`/auth/${AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE}`)
      return result
    },
  })
}
