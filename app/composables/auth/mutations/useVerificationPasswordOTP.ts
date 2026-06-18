import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { verifyPasswordOTP } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useVerificationPasswordOTP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code, email }: { code: string; email: string }) =>
      verifyPasswordOTP(code, email),
    onSuccess: () => {
      navigateTo(`/auth/${AllowedAuthStepsEnum.PASSWORD_RESET_COMPLETE}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
