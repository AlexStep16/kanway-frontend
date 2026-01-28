import { getParsedItemFromLocalStorage } from '@utils/getParsedItemFromLocalStorage'
import BoardModel from '@/models/BoardModel'
import WorkspaceModel from '@/models/WorkspaceModel'
import { PageContextClient } from 'vike/types'
import { Nullable } from '@/types/utils'
import { fetchBoards } from '@/services/board'

export async function determineSelectedBoard(
  pageContext: PageContextClient,
  selectedWorkspace: Nullable<WorkspaceModel>,
  params: Record<string, string>,
) {
  const parsedBoard: Nullable<BoardModel> =
    getParsedItemFromLocalStorage<BoardModel>('selectedBoard')
  let selectedBoard: Nullable<BoardModel> = null

  if (selectedWorkspace && typeof selectedWorkspace === 'object') {
    const loadingBoardsResult = await fetchBoards(selectedWorkspace.id)

    const boardsPayload = loadingBoardsResult

    if (boardsPayload.length > 0) {
      const boardInWorkspace = params.boardId
        ? boardsPayload.find((board: BoardModel) => board.id === params.boardId)
        : null

      if (parsedBoard && !boardInWorkspace) {
        selectedBoard =
          boardsPayload.find((board: BoardModel) => board.id === parsedBoard.id) ?? null
      }

      if (typeof params.boardId === 'string' && params.boardId.length > 0 && boardInWorkspace) {
        selectedBoard = boardInWorkspace
      }
    }
  }
  return selectedBoard
}
