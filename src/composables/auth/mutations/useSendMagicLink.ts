import { sendMagicLink } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useSendMagicLink() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: async (email: string) => {
      localStorage.setItem('resend_timer_login_email', Date.now().toString())
      return sendMagicLink(email)
    },
  })
}
