import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { importYandexTrackerBoards } from '~/services/yandexTracker'
import type { YandexTrackerImportPayload } from '~/interfaces/YandexTrackerImportPayload'

export function useYandexTrackerImport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'yandex-tracker-import'],
    mutationFn: async (payload: YandexTrackerImportPayload) => importYandexTrackerBoards(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() })
      queryClient.invalidateQueries({ queryKey: columnKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
