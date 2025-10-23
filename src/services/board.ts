import { Board } from '@interfaces/Board'
import {
  archiveBoardApi,
  cloneBoardApi,
  deleteBoardApi,
  getBoardsApi,
  postBoardApi,
  putBoardApi,
} from '@api/boards'

export async function fetchBoards(workspace_id: string) {
  const boards = await getBoardsApi(workspace_id)

  return boards
}

export async function createBoard(board: Partial<Board>, workspace_id: string) {
  const newBoard = await postBoardApi(board, workspace_id)

  return newBoard.result
}

export async function saveBoard(payload: Partial<Board> & { _id: string }) {
  const saveResult = await putBoardApi(payload)

  return saveResult
}

export async function removeBoard(boardId: string, workspace_id: string) {
  await deleteBoardApi(boardId, workspace_id)
}

export async function archiveBoard(boardId: string, workspace_id: string) {
  const archiveResult = await archiveBoardApi(boardId, workspace_id)

  return archiveResult
}

export async function cloneBoard(boardId: string, workspace_id: string) {
  const cloneResult = await cloneBoardApi(boardId, workspace_id)

  return cloneResult.result
}
