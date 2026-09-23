import { verifyEmailToken } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useVerificationEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ token }: { token: string }) => verifyEmailToken(token),
    onSuccess: () => {
      navigateTo('/workspace')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
