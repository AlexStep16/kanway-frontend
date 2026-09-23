import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { importTrelloBoardFromJson } from '~/services/trello'
import type { TrelloImportJsonPayload } from '~/interfaces/TrelloImportJsonPayload'

export function useTrelloImportJson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'trello-import-json'],
    mutationFn: async (payload: TrelloImportJsonPayload) => importTrelloBoardFromJson(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() })
      queryClient.invalidateQueries({ queryKey: columnKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })

      if (typeof window !== 'undefined') {
        ;(window as any).ym?.(108746868, 'reachGoal', 'import_trello_success')
      }
    },
  })
}
