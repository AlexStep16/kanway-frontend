import { sendVerificationEmailByToken } from '@/services/auth'
import { BackendError } from '@/utils/errors'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useSendVerificationEmailByToken() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ token }: { token: string }) => sendVerificationEmailByToken(token),
    onError: (error) => {
      if ((error as BackendError).code === 429) {
        toast.error(error.message)
      }
    },
  })
}
