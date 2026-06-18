import { AllowedAuthStepsEnum } from '~/enums/AllowedAuthStepsEnum'
import { verifyPasswordToken } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useVerificationPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: async ({ token }: { token: string }) => verifyPasswordToken(token),
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
