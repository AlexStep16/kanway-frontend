import { useMutation } from '@tanstack/vue-query'
import { fetchYandexTrackerBoards } from '~/services/yandexTracker'
import type { YandexTrackerCredentials } from '~/interfaces/YandexTrackerCredentials'

export function useYandexTrackerBoards() {
  return useMutation({
    mutationKey: ['yandex-tracker', 'boards'],
    mutationFn: async (credentials: YandexTrackerCredentials) =>
      fetchYandexTrackerBoards(credentials),
  })
}
