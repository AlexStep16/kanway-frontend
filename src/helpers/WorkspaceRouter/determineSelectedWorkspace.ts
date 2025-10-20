import { getParsedItemFromLocalStorage } from '@/utils/getParsedItemFromLocalStorage'
import { Workspace } from '@interfaces/Workspace'

export function determineSelectedWorkspace(
  workspaceInWorkspaces: Workspace | null,
  workspacesPayload: Workspace[],
) {
  const parsedWorkspace: Workspace | null =
    getParsedItemFromLocalStorage<Workspace>('selectedWorkspace')
  let selectedWorkspace: Workspace | null = null

  if (parsedWorkspace && !workspaceInWorkspaces) {
    selectedWorkspace =
      workspacesPayload.find((workspace: Workspace) => workspace._id === parsedWorkspace?._id) ??
      workspacesPayload[0]
  } else if (!workspaceInWorkspaces) {
    selectedWorkspace = workspacesPayload[0]

    if (workspaceInWorkspaces) {
      selectedWorkspace = workspaceInWorkspaces
    }
  }

  return selectedWorkspace
}
