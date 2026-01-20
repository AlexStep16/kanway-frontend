import { redirect } from 'vike/abort'
import { PageContextClient } from 'vike/types'
import WorkspaceModel from '@/models/WorkspaceModel'
import { WorkspaceRouteHandler } from '@helpers/WorkspaceRouteHandler'
import { determineSelectedWorkspace } from '@helpers/WorkspaceRouter/determineSelectedWorkspace'
import BoardModel from '@/models/BoardModel'
import { determineSelectedBoard } from '@helpers/WorkspaceRouter/determineSelectedBoard'
import { Nullable } from '@/types/utils'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'

export async function redirectToWorkspace(pageContext: PageContextClient) {
  try {
    const params = pageContext.routeParams

    const { data: workspaces } = useWorkspaces()

    const workspacesPayload = workspaces.value

    if (workspacesPayload.length === 0) {
      throw redirect('/begin')
    }

    const workspaceInWorkspaces = params.workspaceId
      ? (workspacesPayload.find(
          (workspace: WorkspaceModel) => workspace.id === params.workspaceId,
        ) ?? null)
      : null

    const selectedWorkspace: Nullable<WorkspaceModel> = determineSelectedWorkspace(
      workspaceInWorkspaces,
      workspacesPayload,
    )

    let selectedBoard: Nullable<BoardModel> = null

    if (selectedWorkspace) {
      const { data: boards } = useBoards(selectedWorkspace.id)

      selectedBoard = await determineSelectedBoard(selectedWorkspace, boards.value || [], params)
    }

    const router = new WorkspaceRouteHandler(selectedBoard, selectedWorkspace)

    await router.handleRoute(params.boardId, params.workspaceId)
  } catch (e: any) {
    throw e
  }
}
