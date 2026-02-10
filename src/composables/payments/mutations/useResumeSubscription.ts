import { paymentKeys } from '@/keys'
import { resumeSubscription } from '@/services/payment'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'

export function useResumeSubscription() {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => resumeSubscription(),
    onSuccess: () => {
      if (user.value) {
        authStore.setUser({
          ...user.value,
          isSubscriptionActive: true,
        })
      }
    },
  })
}
