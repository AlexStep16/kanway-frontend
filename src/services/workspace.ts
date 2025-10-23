import WorkspaceModel from '@/models/WorkspaceModel'
import WorkspaceRaw from '@interfaces/WorkspaceRaw'
import {
  archiveWorkspaceApi,
  cloneWorkspaceApi,
  deleteWorkspaceApi,
  getWorkspacesApi,
  postWorkspaceApi,
  putWorkspaceApi,
} from '@api/workspaces'
import { toSnakeCaseKeys } from '@utils/objectTransformers'
import { cleanSystemFields } from '@utils/cleanSystemFields'

export function transformWorkspace(raw: WorkspaceRaw): WorkspaceModel {
  return new WorkspaceModel({
    id: raw._id,
    name: raw.name,
    userId: raw.user_id,
    color: raw.color,
    isFavorite: raw.is_favorite,
    isDeleted: raw.is_deleted,
    order: raw.order ?? 0,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })
}

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces.map(transformWorkspace)
}

export async function createWorkspace(payload: Partial<WorkspaceModel>) {
  const apiPayload = toSnakeCaseKeys(cleanSystemFields(payload))

  const newWorkspace = await postWorkspaceApi(apiPayload)

  return newWorkspace.result.map(transformWorkspace)
}

export async function saveWorkspace(payload: Partial<WorkspaceModel> & { id: string }) {
  const apiPayload = toSnakeCaseKeys(cleanSystemFields(payload))
  const saveResult = await putWorkspaceApi(payload.id, apiPayload)

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
