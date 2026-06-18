import { passwordRecovery } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function usePasswordRecovery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ password }: { password: string }) => {
      const result = await passwordRecovery(password)
      await navigateTo('/login')
      return result
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
