import { passwordRecovery } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function usePasswordRecovery() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ password }: { password: string }) => {
      const result = await passwordRecovery(password)
      await navigateTo('/login')
      return result
    },
  })
}
