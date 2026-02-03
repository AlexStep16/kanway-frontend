import { TokenTypesEnum } from '@/enums/TokenTypesEnum'
import { validateToken } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useValidateToken() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token, type }: { token: string; type: TokenTypesEnum }) =>
      validateToken(token, type),
  })
}
