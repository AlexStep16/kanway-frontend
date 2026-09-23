import { useMutation } from '@tanstack/vue-query'
import { fetchTrelloConfig } from '~/services/trello'

export function useTrelloConfig() {
  return useMutation({
    mutationKey: ['trello', 'config'],
    mutationFn: async () => fetchTrelloConfig(),
  })
}
