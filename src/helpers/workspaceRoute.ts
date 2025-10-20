import { redirect } from 'vike/abort'
import { PageContextClient } from 'vike/types'
import { Workspace } from '@interfaces/Workspace'
import { WorkspaceRouteHandler } from '@helpers/WorkspaceRouteHandler'
import { determineSelectedWorkspace } from '@helpers/WorkspaceRouter/determineSelectedWorkspace'
import { Board } from '@interfaces/Board'
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
      ? (workspacesPayload.find((workspace: Workspace) => workspace._id === params.workspaceId) ??
        null)
      : null

    const selectedWorkspace: Workspace | null = determineSelectedWorkspace(
      workspaceInWorkspaces,
      workspacesPayload,
    )
    const selectedBoard: Board | null = await determineSelectedBoard(
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
