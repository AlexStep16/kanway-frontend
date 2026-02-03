import { passwordRecovery } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function usePasswordRecovery() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: ({ password, token }: { password: string; token: string }) =>
      passwordRecovery(token, password),
  })
}
