import { Workspace } from '@/interfaces/Workspace'
import { getWorkspacesApi, postWorkspaceApi, putWorkspaceApi } from '@api/workspaces'

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces
}

export async function createWorkspace(workspace: Partial<Workspace>) {
  const newWorkspace = await postWorkspaceApi(workspace)

  return newWorkspace.result
}

export async function saveWorkspace(workspace: Workspace) {
  const saveResult = await putWorkspaceApi(workspace)

  return saveResult
}
