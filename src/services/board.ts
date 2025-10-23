import BoardModel from '@models/BoardModel'
import BoardRaw from '@interfaces/BoardRaw'
import {
  archiveBoardApi,
  cloneBoardApi,
  deleteBoardApi,
  getBoardsApi,
  postBoardApi,
  putBoardApi,
} from '@api/boards'
import { toSnakeCaseKeys } from '@utils/objectTransformers'
import { cleanSystemFields } from '@utils/cleanSystemFields'

export function transformBoard(raw: BoardRaw): BoardModel {
  return new BoardModel({
    id: raw._id,
    name: raw.name,
    workspaceId: raw.workspace_id,
    isDeleted: raw.is_deleted,
    isFavorite: raw.is_favorite,
    order: raw.order ?? 0,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchBoards(workspaceId: string) {
  const boards = await getBoardsApi(workspaceId)

  return boards.map(transformBoard)
}

export async function createBoard(payload: Partial<BoardModel>, workspaceId: string) {
  const apiPayload = toSnakeCaseKeys(cleanSystemFields(payload))
  const newBoard = await postBoardApi(apiPayload, workspaceId)

  return newBoard.result.map(transformBoard)
}

export async function saveBoard(
  payload: Partial<BoardModel> & { id: string; workspaceId: string },
) {
  const apiPayload = toSnakeCaseKeys(cleanSystemFields(payload))
  const saveResult = await putBoardApi(payload.id, payload.workspaceId, apiPayload)

  return saveResult.map(transformBoard)
}

export async function removeBoard(boardId: string, workspaceId: string) {
  await deleteBoardApi(boardId, workspaceId)
}

export async function archiveBoard(boardId: string, workspaceId: string) {
  const archiveResult = await archiveBoardApi(boardId, workspaceId)

  return archiveResult.map(transformBoard)
}

export async function cloneBoard(boardId: string, workspaceId: string) {
  const cloneResult = await cloneBoardApi(boardId, workspaceId)

  return cloneResult.result.map(transformBoard)
}
