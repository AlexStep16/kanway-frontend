import { paymentKeys, userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { resumeSubscription } from '@/services/payment'
import { useMutation } from '@tanstack/vue-query'

export function useResumeSubscription() {
  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => resumeSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
