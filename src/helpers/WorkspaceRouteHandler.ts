import { redirect } from 'vike/abort'
import BoardModel from '@/models/BoardModel'
import WorkspaceModel from '@/models/WorkspaceModel'
import { Nullable } from '@/types/utils'

export class WorkspaceRouteHandler {
  selectedBoard: Nullable<BoardModel>
  selectedWorkspace: Nullable<WorkspaceModel>

  constructor(selectedBoard: Nullable<BoardModel>, selectedWorkspace: Nullable<WorkspaceModel>) {
    this.selectedBoard = selectedBoard
    this.selectedWorkspace = selectedWorkspace
  }

  async handleRoute(boardId: string, workspaceId: string): Promise<void> {
    let workspaceRoute: string = ''
    let boardRoute: string = ''

    if (workspaceId && this.selectedWorkspace && workspaceId === this.selectedWorkspace.id) {
      workspaceRoute = workspaceId
    } else if (this.selectedWorkspace) {
      workspaceRoute = this.selectedWorkspace.id
    }

    if (boardId && this.selectedBoard && boardId === this.selectedBoard.id) {
      boardRoute = boardId
    } else if (!boardId && this.selectedBoard) {
      boardRoute = this.selectedBoard.id
    } else if (boardId && ['archive', 'settings'].includes(boardId)) {
      boardRoute = boardId
    }

    if (workspaceId === this.selectedWorkspace?.id && boardId === this.selectedBoard?.id) {
      return
    }

    if (workspaceRoute) {
      if (boardRoute && boardRoute.length > 0) {
        throw redirect(`/workspace/${workspaceRoute}/${boardRoute}`)
      } else {
        throw redirect(`/workspace/${workspaceRoute}`)
      }
    }
  }
}
