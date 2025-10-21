import { Board } from '@interfaces/Board'
import { getBoardsApi, postBoardApi, putBoardApi } from '@api/boards'

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
