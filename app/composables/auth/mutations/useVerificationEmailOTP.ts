import { verifyEmailOTP } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useVerificationEmailOTP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ code, email }: { code: string; email: string }) => verifyEmailOTP(code, email),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
