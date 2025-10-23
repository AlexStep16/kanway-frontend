import { Workspace } from '@/interfaces/Workspace'
import {
  archiveWorkspaceApi,
  cloneWorkspaceApi,
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

export async function saveWorkspace(payload: Partial<Workspace> & { _id: string }) {
  const saveResult = await putWorkspaceApi(payload)

  return saveResult
}

export async function removeWorkspace(workspaceId: string) {
  await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspace(workspaceId: string) {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  return archiveResult
}

export async function cloneWorkspace(workspaceId: string) {
  const cloneResult = await cloneWorkspaceApi(workspaceId)

  return cloneResult.result
}
