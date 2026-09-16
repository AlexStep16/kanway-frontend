import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { transcribeVoice } from '~/services/ai'

export function useTranscribeVoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: (file: Blob) => transcribeVoice(file),
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        ;(window as any).ym?.(108746868, 'reachGoal', 'transcribe_voice_success')
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
