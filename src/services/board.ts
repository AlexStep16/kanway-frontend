import { getBoardsApi } from '@api/boards'

export async function fetchBoards(workspace_id: string) {
  const boards = await getBoardsApi(workspace_id)

  return boards
}
