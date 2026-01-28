import { redirect } from 'vike/abort'
import { PageContextClient } from 'vike/types'
import WorkspaceModel from '@/models/WorkspaceModel'
import { WorkspaceRouteHandler } from '@helpers/WorkspaceRouteHandler'
import { determineSelectedWorkspace } from '@helpers/WorkspaceRouter/determineSelectedWorkspace'
import BoardModel from '@/models/BoardModel'
import { determineSelectedBoard } from '@helpers/WorkspaceRouter/determineSelectedBoard'
import { Nullable } from '@/types/utils'
import { fetchWorkspaces } from '@/services/workspace'
import { queryClient } from '@/plugins/queryClient'
import { workspaceKeys } from '@/keys'

export async function redirectToWorkspace(pageContext: PageContextClient) {
  try {
    const params = pageContext.routeParams

    const workspacesPayload = await queryClient.fetchQuery({
      queryKey: workspaceKeys.lists(),
      queryFn: fetchWorkspaces,
    })

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
    const selectedBoard: Nullable<BoardModel> = await determineSelectedBoard(
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
