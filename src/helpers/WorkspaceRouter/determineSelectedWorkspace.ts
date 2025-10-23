import { getParsedItemFromLocalStorage } from '@/utils/getParsedItemFromLocalStorage'
import WorkspaceModel from '@/models/WorkspaceModel'

export function determineSelectedWorkspace(
  workspaceInWorkspaces: WorkspaceModel | null,
  workspacesPayload: WorkspaceModel[],
) {
  const parsedWorkspace: WorkspaceModel | null =
    getParsedItemFromLocalStorage<WorkspaceModel>('selectedWorkspace')
  let selectedWorkspace: WorkspaceModel | null = null

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
