import { passwordRecovery } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { navigate } from 'vike/client/router'

export function usePasswordRecovery() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async ({ password }: { password: string }) => {
      const result = await passwordRecovery(password)
      await navigate('/login')
      return result
    },
  })
}
