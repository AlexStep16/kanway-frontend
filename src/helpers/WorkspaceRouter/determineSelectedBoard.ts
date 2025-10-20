import { getParsedItemFromLocalStorage } from '@utils/getParsedItemFromLocalStorage'
import { Board } from '@interfaces/Board'
import { Workspace } from '@interfaces/Workspace'
import { useBoardDataStore } from '@stores/boardData'
import { PageContextClient } from 'vike/types'

export async function determineSelectedBoard(
  pageContext: PageContextClient,
  selectedWorkspace: Workspace | null,
  params: Record<string, string>,
) {
  const parsedBoard: Board | null = getParsedItemFromLocalStorage<Board>('selectedBoard')
  let selectedBoard: Board | null = null

  if (selectedWorkspace && typeof selectedWorkspace === 'object') {
    const BOARD_STORE = useBoardDataStore(pageContext.pinia)

    const loadingBoardsResult = await BOARD_STORE.loadBoards(selectedWorkspace._id)

    if (!loadingBoardsResult) {
      throw BOARD_STORE.loadBoardsError
    }

    const boardsPayload = BOARD_STORE.boards

    if (boardsPayload.length > 0) {
      const boardInWorkspace = params.boardId
        ? boardsPayload.find((board: Board) => board._id === params.boardId)
        : null

      if (parsedBoard && !boardInWorkspace) {
        selectedBoard = boardsPayload.find((board: Board) => board._id === parsedBoard._id) ?? null
      }

      if (typeof params.boardId === 'string' && params.boardId.length > 0 && boardInWorkspace) {
        selectedBoard = boardInWorkspace
      }
    }
  }
  return selectedBoard
}
