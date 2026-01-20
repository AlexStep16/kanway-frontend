import { getParsedItemFromLocalStorage } from '@utils/getParsedItemFromLocalStorage'
import BoardModel from '@/models/BoardModel'
import WorkspaceModel from '@/models/WorkspaceModel'
import { Nullable } from '@/types/utils'

export async function determineSelectedBoard(
  selectedWorkspace: WorkspaceModel,
  boards: BoardModel[],
  params: Record<string, string>,
) {
  const parsedBoard: Nullable<BoardModel> =
    getParsedItemFromLocalStorage<BoardModel>('selectedBoard')
  let selectedBoard: Nullable<BoardModel> = null

  if (selectedWorkspace && typeof selectedWorkspace === 'object') {
    const boardsPayload = boards || []

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
