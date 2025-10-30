import WorkspaceModel from '@/models/WorkspaceModel'
import IWorkspace from '@models/WorkspaceModel'
import {
  archiveWorkspaceApi,
  cloneWorkspaceApi,
  deleteWorkspaceApi,
  getWorkspacesApi,
  postWorkspaceApi,
  putWorkspaceApi,
} from '@api/workspaces'

export function transformWorkspace(raw: IWorkspace): WorkspaceModel {
  return new WorkspaceModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function createWorkspace(payload: Partial<WorkspaceModel>) {
  const newWorkspace = await postWorkspaceApi(payload)

  return newWorkspace.result.map(transformWorkspace)
}

export async function saveWorkspace(payload: Partial<WorkspaceModel> & { id: string }) {
  const saveResult = await putWorkspaceApi(payload.id, payload)

  return saveResult.map(transformWorkspace)
}

export async function removeWorkspace(workspaceId: string) {
  await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspace(workspaceId: string) {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  return archiveResult.map(transformWorkspace)
}

export async function cloneWorkspace(workspaceId: string) {
  const cloneResult = await cloneWorkspaceApi(workspaceId)

  return cloneResult.result.map(transformWorkspace)
}
