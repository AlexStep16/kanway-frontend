import WorkspaceModel from '~/models/WorkspaceModel'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import type { IResponseWithLog } from '~/interfaces/IResponseWithLog'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { WelcomePayload } from '~/interfaces/WelcomePayload'

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

export async function fetchWorkspacesCount() {
  const count = await getWorkspacesCountApi()

  return count
}

export async function fetchWorkspace(id: string) {
  const workspaces = await getWorkspaceApi(id)
  const workspace = workspaces.length > 0 ? workspaces[0] : null

  return workspace ? transformWorkspace(workspace) : null
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

export async function removeWorkspace(workspaceId: string): Promise<IResponseWithLog<null>> {
  return await deleteWorkspaceApi(workspaceId)
}

export async function archiveWorkspace(
  workspaceId: string,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const archiveResult = await archiveWorkspaceApi(workspaceId)

  return {
    data: archiveResult.data.map(transformWorkspace),
    logId: archiveResult.logId,
  }
}

export async function recoverWorkspace(
  workspaceId: string,
): Promise<IResponseWithLog<IWorkspace[]>> {
  const recoverResult = await recoverWorkspaceApi(workspaceId)

  return {
    data: recoverResult.data.map(transformWorkspace),
    logId: recoverResult.logId,
  }
}

export async function cloneWorkspace(workspaceId: string): Promise<IResponseWithLog<IWorkspace[]>> {
  const cloneResult = await cloneWorkspaceApi(workspaceId)

  return {
    data: cloneResult.data.map(transformWorkspace),
    logId: cloneResult.logId,
  }
}

export async function welcome(payload: WelcomePayload): Promise<IWorkspace> {
  const workspace = await welcomeApi(payload)

  return transformWorkspace(workspace)
}
