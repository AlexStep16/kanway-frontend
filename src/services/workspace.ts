import WorkspaceModel from '@/models/WorkspaceModel'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import {
  archiveWorkspaceApi,
  cloneWorkspaceApi,
  deleteWorkspaceApi,
  getWorkspacesApi,
  postWorkspaceApi,
  patchWorkspaceApi,
  getArchivedWorkspacesApi,
  recoverWorkspaceApi,
  getWorkspaceApi,
} from '@api/workspaces'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'

export function transformWorkspace(raw: IWorkspace): WorkspaceModel {
  return new WorkspaceModel({
    ...raw,
    deletedTime: raw.deletedTime ? new Date(raw.deletedTime) : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function fetchWorkspace(id: string) {
  const workspaces = await getWorkspaceApi(id)

  return workspaces.map(transformWorkspace)[0]
}

export async function fetchArchivedWorkspaces() {
  const workspaces = await getArchivedWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function createWorkspace(
  payload: Partial<WorkspaceModel>,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const newWorkspace = await postWorkspaceApi(payload)

  return {
    data: newWorkspace.data.map(transformWorkspace),
    logId: newWorkspace.logId,
  }
}

export async function saveWorkspace(
  payload: ISingleUpdate<Partial<IWorkspace>>,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const saveResult = await patchWorkspaceApi(payload.id, payload)

  return {
    data: saveResult.data.map(transformWorkspace),
    logId: saveResult.logId,
  }
}

export async function removeWorkspace(workspaceId: string) {
  await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspace(
  workspaceId: string,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  return {
    data: archiveResult.data.workspaces.map(transformWorkspace),
    logId: archiveResult.logId,
  }
}

export async function recoverWorkspace(
  workspaceId: string,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const recoverResult = await recoverWorkspaceApi(workspaceId)

  return {
    data: recoverResult.data.workspaces.map(transformWorkspace),
    logId: recoverResult.logId,
  }
}

export async function cloneWorkspace(workspaceId: string): Promise<IResponseWithLog<IWorkspace[]>> {
  const cloneResult = await cloneWorkspaceApi(workspaceId)

  return {
    data: cloneResult.data.workspaces.map(transformWorkspace),
    logId: cloneResult.logId,
  }
}
