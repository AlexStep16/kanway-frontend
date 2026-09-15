import { transformBoard } from '~/services/board'
import type { YandexTrackerConnectPayload } from '~/interfaces/YandexTrackerConnectPayload'
import type { YandexTrackerCredentials } from '~/interfaces/YandexTrackerCredentials'
import type { YandexTrackerImportPayload } from '~/interfaces/YandexTrackerImportPayload'
import {
  connectYandexTrackerApi,
  getYandexTrackerBoardsApi,
  importYandexTrackerBoardsApi,
} from '~/utils/api/yandexTracker'

export async function connectYandexTracker(payload: YandexTrackerConnectPayload) {
  return await connectYandexTrackerApi(payload)
}

export async function fetchYandexTrackerBoards(credentials: YandexTrackerCredentials) {
  return await getYandexTrackerBoardsApi(credentials)
}

export async function importYandexTrackerBoards(payload: YandexTrackerImportPayload) {
  const boards = await importYandexTrackerBoardsApi(payload)

  return boards.map(transformBoard)
}
