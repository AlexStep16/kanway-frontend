import type { IBoard } from '~/interfaces/domain/IBoard'
import type { IYandexTrackerBoard } from '~/interfaces/domain/IYandexTrackerBoard'
import type { YandexTrackerConnectPayload } from '~/interfaces/YandexTrackerConnectPayload'
import type { YandexTrackerCredentials } from '~/interfaces/YandexTrackerCredentials'
import type { YandexTrackerImportPayload } from '~/interfaces/YandexTrackerImportPayload'

export async function connectYandexTrackerApi(payload: YandexTrackerConnectPayload) {
  return await apiCall<{ token: string }>({
    method: 'POST',
    url: '/yandex-tracker/connect',
    data: payload,
  })
}

export async function getYandexTrackerBoardsApi(credentials: YandexTrackerCredentials) {
  return await apiCall<IYandexTrackerBoard[]>({
    method: 'GET',
    url: '/yandex-tracker/boards',
    params: {
      token: credentials.token,
      orgId: credentials.orgId,
    },
  })
}

export async function importYandexTrackerBoardsApi(payload: YandexTrackerImportPayload) {
  return await apiCall<IBoard[]>({
    method: 'POST',
    url: '/yandex-tracker/import',
    data: payload,
  })
}
