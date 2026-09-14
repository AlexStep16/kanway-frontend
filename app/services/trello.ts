import { transformBoard } from '~/services/board'
import type { TrelloImportPayload } from '~/interfaces/TrelloImportPayload'
import type { TrelloImportJsonPayload } from '~/interfaces/TrelloImportJsonPayload'
import {
  getTrelloBoardsApi,
  getTrelloConfigApi,
  importTrelloBoardFromJsonApi,
  importTrelloBoardsApi,
} from '~/utils/api/trello'

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

export async function importTrelloBoardFromJson(payload: TrelloImportJsonPayload) {
  const board = await importTrelloBoardFromJsonApi(payload)

  return transformBoard(board)
}
