import { Board } from '@interfaces/Board'
import {
  archiveBoardApi,
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

export async function saveBoard(board: Board, workspace_id: string) {
  const saveResult = await putBoardApi(board, workspace_id)

  return saveResult
}

export async function removeBoard(boardId: string, workspace_id: string) {
  await deleteBoardApi(boardId, workspace_id)
}

export async function archiveBoardService(boardId: string, workspace_id: string) {
  const archiveResult = await archiveBoardApi(boardId, workspace_id)

  return archiveResult
}
