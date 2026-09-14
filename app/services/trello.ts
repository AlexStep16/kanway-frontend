import { transformBoard } from '~/services/board'
import type { TrelloImportPayload } from '~/interfaces/TrelloImportPayload'
import { getTrelloBoardsApi, getTrelloConfigApi, importTrelloBoardsApi } from '~/utils/api/trello'

export async function fetchTrelloConfig() {
  return await getTrelloConfigApi()
}

export async function fetchTrelloBoards(token: string) {
  return await getTrelloBoardsApi(token)
}

export async function importTrelloBoards(payload: TrelloImportPayload) {
  const boards = await importTrelloBoardsApi(payload)

  return boards.map(transformBoard)
}
