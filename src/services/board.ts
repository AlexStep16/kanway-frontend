import BoardModel from '@models/BoardModel'
import { IBoard } from '@interfaces/domain/IBoard'
import {
  archiveBoardApi,
  cloneBoardApi,
  deleteBoardApi,
  getBoardsApi,
  postBoardApi,
  patchBoardApi,
  getArchivedBoardsApi,
  recoverBoardApi,
  getBoardsCountApi,
  getBoardApi,
} from '@api/boards'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { IBoardCreateApiPayload } from '@/interfaces/IBoardCreateApiPayload'
import { IBoardEditApiPayload } from '@/interfaces/IBoardEditApiPayload'

export function transformBoard(raw: IBoard): BoardModel {
  return new BoardModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchBoards(workspaceId?: string) {
  const boards = await getBoardsApi(workspaceId)

  return boards.map(transformBoard)
}

export async function fetchBoard(id: string) {
  const boards = await getBoardApi(id)
  const board = boards.length > 0 ? boards[0] : null

  return board ? transformBoard(board) : null
}

export async function fetchBoardsCount(workspaceId?: string | null) {
  const count = await getBoardsCountApi(workspaceId)

  return count
}

export async function fetchArchivedBoards() {
  const boards = await getArchivedBoardsApi()

  return boards.map(transformBoard)
}

export async function createBoard(
  payload: IBoardCreateApiPayload,
): Promise<IResponseWithLog<IBoard[]>> {
  const newBoard = await postBoardApi(payload)

  return {
    data: newBoard.data.map(transformBoard),
    logId: newBoard.logId,
  }
}

export async function saveBoard(payload: IBoardEditApiPayload) {
  const saveResult = await patchBoardApi(payload)

  return {
    data: saveResult.data.map(transformBoard),
    logId: saveResult.logId,
  }
}

export async function removeBoard(id: string): Promise<IResponseWithLog<null>> {
  return await deleteBoardApi(id)
}

export async function archiveBoard(id: string): Promise<IResponseWithLog<IBoard[]>> {
  const archiveResult = await archiveBoardApi(id)

  return {
    data: archiveResult.data.map(transformBoard),
    logId: archiveResult.logId,
  }
}

export async function recoverBoard(id: string): Promise<IResponseWithLog<IBoard[]>> {
  const recoverResult = await recoverBoardApi(id)

  return {
    data: recoverResult.data.map(transformBoard),
    logId: recoverResult.logId,
  }
}

export async function cloneBoard(id: string): Promise<IResponseWithLog<IBoard[]>> {
  const cloneResult = await cloneBoardApi(id)

  return {
    data: cloneResult.data.map(transformBoard),
    logId: cloneResult.logId,
  }
}
