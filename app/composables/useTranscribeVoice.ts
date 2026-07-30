import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { transcribeVoice } from '~/services/ai'

export function useTranscribeVoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: (file: Blob) => transcribeVoice(file),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
