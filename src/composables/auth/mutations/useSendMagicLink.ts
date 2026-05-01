import { ResendStorageKeysEnum } from '@/enums/ResendStorageKeysEnum'
import { sendMagicLink } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useSendMagicLink() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async (email: string) => sendMagicLink(email),
    onSuccess: () => {
      localStorage.setItem(ResendStorageKeysEnum.LOGIN_VERIFICATION, Date.now().toString())
    },
  })
}
