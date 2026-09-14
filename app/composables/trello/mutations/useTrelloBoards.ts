import { useMutation } from '@tanstack/vue-query'
import { fetchTrelloBoards } from '~/services/trello'

export function useTrelloBoards() {
  return useMutation({
    mutationKey: ['trello', 'boards'],
    mutationFn: async (token: string) => fetchTrelloBoards(token),
  })
}
