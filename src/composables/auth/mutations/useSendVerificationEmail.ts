import { sendVerificationEmail } from '@/services/auth'
import { BackendError } from '@/utils/errors'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useSendVerificationEmail() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: () => sendVerificationEmail(),
    onError: (error) => {
      if ((error as BackendError).code === 429) {
        toast.error(error.message)
      }
    },
  })
}
