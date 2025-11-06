import { getParsedItemFromLocalStorage } from '@/utils/getParsedItemFromLocalStorage'
import WorkspaceModel from '@/models/WorkspaceModel'
import { Nullable } from '@/types/utils'

export function determineSelectedWorkspace(
  workspaceInWorkspaces: Nullable<WorkspaceModel>,
  workspacesPayload: WorkspaceModel[],
) {
  const parsedWorkspace: Nullable<WorkspaceModel> =
    getParsedItemFromLocalStorage<WorkspaceModel>('selectedWorkspace')
  let selectedWorkspace: Nullable<WorkspaceModel> = null

  if (parsedWorkspace && !workspaceInWorkspaces) {
    selectedWorkspace =
      workspacesPayload.find((workspace: WorkspaceModel) => workspace.id === parsedWorkspace?.id) ??
      workspacesPayload[0]
  } else if (!workspaceInWorkspaces) {
    selectedWorkspace = workspacesPayload[0]
  } else {
    if (workspaceInWorkspaces) {
      selectedWorkspace = workspaceInWorkspaces
    }
  }

  return selectedWorkspace
}
