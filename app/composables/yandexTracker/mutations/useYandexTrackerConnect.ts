import { useMutation } from '@tanstack/vue-query'
import { connectYandexTracker } from '~/services/yandexTracker'
import type { YandexTrackerConnectPayload } from '~/interfaces/YandexTrackerConnectPayload'

export function useYandexTrackerConnect() {
  return useMutation({
    mutationKey: ['yandex-tracker', 'connect'],
    mutationFn: async (payload: YandexTrackerConnectPayload) => connectYandexTracker(payload),
  })
}
