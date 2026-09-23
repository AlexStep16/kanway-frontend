import type { IBoard } from '~/interfaces/domain/IBoard'
import type { ITrelloBoard } from '~/interfaces/domain/ITrelloBoard'
import type { ITrelloConfig } from '~/interfaces/ITrelloConfig'
import type { TrelloImportPayload } from '~/interfaces/TrelloImportPayload'
import type { TrelloImportJsonPayload } from '~/interfaces/TrelloImportJsonPayload'

export async function getTrelloConfigApi() {
  return await apiCall<ITrelloConfig>({
    method: 'GET',
    url: '/trello/config',
  })
}

export async function getTrelloBoardsApi(token: string) {
  return await apiCall<ITrelloBoard[]>({
    method: 'GET',
    url: '/trello/boards',
    params: { token },
  })
}

export async function importTrelloBoardsApi(payload: TrelloImportPayload) {
  return await apiCall<IBoard[]>({
    method: 'POST',
    url: '/trello/import',
    data: payload,
  })
}

export async function importTrelloBoardFromJsonApi(payload: TrelloImportJsonPayload) {
  return await apiCall<IBoard>({
    method: 'POST',
    url: '/trello/import-json',
    data: payload,
  })
}
