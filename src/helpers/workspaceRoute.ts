import { redirect } from 'vike/abort'
import { PageContextClient } from 'vike/types'
import WorkspaceModel from '@/models/WorkspaceModel'
import { WorkspaceRouteHandler } from '@helpers/WorkspaceRouteHandler'
import { determineSelectedWorkspace } from '@helpers/WorkspaceRouter/determineSelectedWorkspace'
import BoardModel from '@/models/BoardModel'
import { determineSelectedBoard } from '@helpers/WorkspaceRouter/determineSelectedBoard'
import { useWorkspaceDataStore } from '@/stores/workspaceData'

export async function redirectToWorkspace(pageContext: PageContextClient) {
  try {
    const params = pageContext.routeParams
    const WORKSPACE_STORE = useWorkspaceDataStore(pageContext.pinia)

    const workspacesLoadingResult = await WORKSPACE_STORE.loadWorkspaces()

    if (!workspacesLoadingResult) {
      throw WORKSPACE_STORE.loadWorkspacesError
    }

    const workspacesPayload = WORKSPACE_STORE.workspaces

    if (workspacesPayload.length === 0) {
      throw redirect('/begin')
    }

    const workspaceInWorkspaces = params.workspaceId
      ? (workspacesPayload.find(
          (workspace: WorkspaceModel) => workspace.id === params.workspaceId,
        ) ?? null)
      : null

    const selectedWorkspace: WorkspaceModel | null = determineSelectedWorkspace(
      workspaceInWorkspaces,
      workspacesPayload,
    )
    const selectedBoard: BoardModel | null = await determineSelectedBoard(
      pageContext,
      selectedWorkspace,
      params,
    )

    const router = new WorkspaceRouteHandler(selectedBoard, selectedWorkspace)

    await router.handleRoute(params.boardId, params.workspaceId)
  } catch (e: any) {
    throw e
  }
}
