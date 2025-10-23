import { getParsedItemFromLocalStorage } from '@utils/getParsedItemFromLocalStorage'
import BoardModel from '@/models/BoardModel'
import WorkspaceModel from '@/models/WorkspaceModel'
import { useBoardDataStore } from '@stores/boardData'
import { PageContextClient } from 'vike/types'

export async function determineSelectedBoard(
  pageContext: PageContextClient,
  selectedWorkspace: WorkspaceModel | null,
  params: Record<string, string>,
) {
  const parsedBoard: BoardModel | null = getParsedItemFromLocalStorage<BoardModel>('selectedBoard')
  let selectedBoard: BoardModel | null = null

  if (selectedWorkspace && typeof selectedWorkspace === 'object') {
    const BOARD_STORE = useBoardDataStore(pageContext.pinia)

    const loadingBoardsResult = await BOARD_STORE.loadBoards(selectedWorkspace.id)

    if (!loadingBoardsResult) {
      throw BOARD_STORE.loadBoardsError
    }

    const boardsPayload = BOARD_STORE.boards

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
