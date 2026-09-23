import { verifyLoginToken } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useVerificationLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token }: { token: string }) => verifyLoginToken(token),
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
