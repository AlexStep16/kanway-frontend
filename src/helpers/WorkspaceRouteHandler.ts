import { redirect } from 'vike/abort'
import { Board } from '@interfaces/Board'
import { Workspace } from '@interfaces/Workspace'

export class WorkspaceRouteHandler {
  selectedBoard: Board | null
  selectedWorkspace: Workspace | null

  constructor(selectedBoard: Board | null, selectedWorkspace: Workspace | null) {
    this.selectedBoard = selectedBoard
    this.selectedWorkspace = selectedWorkspace
  }

  async handleRoute(boardId: string, workspaceId: string): Promise<void> {
    let workspaceRoute: string = ''
    let boardRoute: string = ''

    if (workspaceId && this.selectedWorkspace && workspaceId === this.selectedWorkspace._id) {
      workspaceRoute = workspaceId
    } else if (this.selectedWorkspace) {
      workspaceRoute = this.selectedWorkspace._id
    }

    if (boardId && this.selectedBoard && boardId === this.selectedBoard._id) {
      boardRoute = boardId
    } else if (!boardId && this.selectedBoard) {
      boardRoute = this.selectedBoard._id
    } else if (boardId && ['archive', 'settings'].includes(boardId)) {
      boardRoute = boardId
    }

    if (
      workspaceId === this.selectedWorkspace?._id &&
      (boardId === this.selectedBoard?._id || ['archive', 'settings'].includes(boardId))
    ) {
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
