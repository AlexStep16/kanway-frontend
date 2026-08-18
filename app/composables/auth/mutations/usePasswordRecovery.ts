import { passwordRecovery } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function usePasswordRecovery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: async ({ password }: { password: string }) => passwordRecovery(password),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
