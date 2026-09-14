import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { importTrelloBoards } from '~/services/trello'
import type { TrelloImportPayload } from '~/interfaces/TrelloImportPayload'

export function useTrelloImport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'trello-import'],
    mutationFn: async (payload: TrelloImportPayload) => importTrelloBoards(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() })
      queryClient.invalidateQueries({ queryKey: columnKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
