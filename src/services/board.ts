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
} from '@api/boards'
import { useCategoryDataStore } from '@stores/categoryData'
import { useTaskDataStore } from '@stores/taskData'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'

export function transformBoard(raw: IBoard): BoardModel {
  return new BoardModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchBoards(workspaceId: string) {
  const boards = await getBoardsApi(workspaceId)

  return boards.map(transformBoard)
}

export async function fetchBoardsCount(workspaceId: string) {
  const count = await getBoardsCountApi(workspaceId)

  return count
}

export async function fetchArchivedBoards() {
  const boards = await getArchivedBoardsApi()

  return boards.map(transformBoard)
}

export async function createBoard(
  payload: Partial<BoardModel>,
  workspaceId: string,
): Promise<IResponseWithLog<IBoard[]>> {
  const newBoard = await postBoardApi(payload, workspaceId)

  return {
    data: newBoard.data.map(transformBoard),
    logId: newBoard.logId,
  }
}

export async function saveBoard(payload: ISingleUpdate<BoardModel>, workspaceId: string) {
  const saveResult = await patchBoardApi(payload.id, workspaceId, payload)

  return {
    data: saveResult.data.map(transformBoard),
    logId: saveResult.logId,
  }
}

export async function removeBoard(boardId: string, workspaceId: string) {
  await deleteBoardApi(boardId, workspaceId)
}

export async function archiveBoard(
  boardId: string,
  workspaceId: string,
): Promise<IResponseWithLog<IBoard[]>> {
  const archiveResult = await archiveBoardApi(boardId, workspaceId)

  useCategoryDataStore().integrateCategories(archiveResult.data.categories)
  useTaskDataStore().integrateTasks(archiveResult.data.tasks)

  return {
    data: archiveResult.data.boards.map(transformBoard),
    logId: archiveResult.logId,
  }
}

export async function recoverBoard(
  boardId: string,
  workspaceId: string,
): Promise<IResponseWithLog<IBoard[]>> {
  const recoverResult = await recoverBoardApi(boardId, workspaceId)

  useCategoryDataStore().integrateCategories(recoverResult.data.categories)
  useTaskDataStore().integrateTasks(recoverResult.data.tasks)

  return {
    data: recoverResult.data.boards.map(transformBoard),
    logId: recoverResult.logId,
  }
}

export async function cloneBoard(
  boardId: string,
  workspaceId: string,
): Promise<IResponseWithLog<IBoard[]>> {
  const cloneResult = await cloneBoardApi(boardId, workspaceId)

  useCategoryDataStore().integrateCategories(cloneResult.data.categories)
  useTaskDataStore().integrateTasks(cloneResult.data.tasks)

  return {
    data: cloneResult.data.boards.map(transformBoard),
    logId: cloneResult.logId,
  }
}
