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
} from '@api/boards'
import { useCategoryDataStore } from '@stores/categoryData'
import { useTaskDataStore } from '@stores/taskData'

export function transformBoard(raw: IBoard): BoardModel {
  return new BoardModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchBoards(workspaceId: string) {
  const boards = await getBoardsApi(workspaceId)

  return boards.map(transformBoard)
}

export async function fetchArchivedBoards() {
  const boards = await getArchivedBoardsApi()

  return boards.map(transformBoard)
}

export async function createBoard(payload: Partial<BoardModel>, workspaceId: string) {
  const newBoard = await postBoardApi(payload, workspaceId)

  return newBoard.map(transformBoard)
}

export async function saveBoard(
  payload: Partial<BoardModel> & { id: string; workspaceId: string },
) {
  const saveResult = await patchBoardApi(payload.id, payload.workspaceId, payload)

  return saveResult.map(transformBoard)
}

export async function removeBoard(boardId: string, workspaceId: string) {
  await deleteBoardApi(boardId, workspaceId)
}

export async function archiveBoard(boardId: string, workspaceId: string) {
  const archiveResult = await archiveBoardApi(boardId, workspaceId)

  return archiveResult.map(transformBoard)
}

export async function recoverBoard(boardId: string, workspaceId: string) {
  const recoverResult = await recoverBoardApi(boardId, workspaceId)

  return recoverResult.map(transformBoard)
}

export async function cloneBoard(boardId: string, workspaceId: string) {
  const cloneResult = await cloneBoardApi(boardId, workspaceId)

  useCategoryDataStore().integrateCategories(cloneResult.categories)
  useTaskDataStore().integrateTasks(cloneResult.tasks)

  return cloneResult.boards.map(transformBoard)
}
