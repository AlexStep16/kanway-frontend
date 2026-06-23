import { passwordRecovery } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function usePasswordRecovery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ password }: { password: string }) => passwordRecovery(password),
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
