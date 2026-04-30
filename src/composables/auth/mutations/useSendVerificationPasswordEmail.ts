import { sendPasswordRecoveryEmail } from '@/services/auth'
import { BackendError } from '@/utils/errors'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useSendVerificationPasswordEmail() {
  return useMutation({
    mutationKey: ['user'],
    meta: {
      errorMessage: false,
    },
    mutationFn: async (email: string) => {
      localStorage.setItem('resend_timer_verification_password', Date.now().toString())
      return sendPasswordRecoveryEmail(email)
    },
    onError: (error) => {
      if ((error as BackendError).code === 429) {
        toast.error(error.message)
      }
    },
  })
}
