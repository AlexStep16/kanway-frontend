import { Workspace } from '@/interfaces/Workspace'
import {
  archiveWorkspaceApi,
  deleteWorkspaceApi,
  getWorkspacesApi,
  postWorkspaceApi,
  putWorkspaceApi,
} from '@api/workspaces'

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

export async function removeWorkspace(workspaceId: string) {
  await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspaceService(workspaceId: string) {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  return archiveResult
}
