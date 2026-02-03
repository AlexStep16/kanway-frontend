import { sendPasswordRecoveryEmail } from '@/services/auth'
import { BackendError } from '@/utils/errors'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useSendPasswordRecoveryEmail() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: ({ email }: { email: string }) => sendPasswordRecoveryEmail(email),
    onError: (error) => {
      if ((error as BackendError).code === 429) {
        toast.error(error.message)
      }
    },
  })
}
