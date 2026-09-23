import { resumeSubscription } from '~/services/payment'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useResumeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: paymentKeys.all,
    mutationFn: () => resumeSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
