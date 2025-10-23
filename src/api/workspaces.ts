import { apiCall } from '@/apiClient'
import { CRUDResponse } from '@interfaces/CRUDResponse'
import WorkspaceRaw from '@interfaces/WorkspaceRaw'
import BoardRaw from '@interfaces/BoardRaw'

export async function getWorkspacesApi() {
  return await apiCall<WorkspaceRaw[]>({
    method: 'GET',
    url: '/workspaces',
  })
}

export async function postWorkspaceApi(payload: Partial<BoardRaw>) {
  return await apiCall<CRUDResponse<WorkspaceRaw>>({
    method: 'POST',
    url: `/workspaces`,
    data: payload,
  })
}

export async function putWorkspaceApi(workspaceId: string, payload: Partial<BoardRaw>) {
  return await apiCall<WorkspaceRaw[]>({
    method: 'PUT',
    url: `/workspaces/${workspaceId}`,
    data: payload,
  })
}

export async function deleteWorkspaceApi(workspaceId: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/workspaces/${workspaceId}`,
  })
}

export async function archiveWorkspaceApi(workspaceId: string) {
  return await apiCall<WorkspaceRaw[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/archive`,
  })
}

export async function cloneWorkspaceApi(workspaceId: string) {
  return await apiCall<CRUDResponse<WorkspaceRaw>>({
    method: 'PUT',
    url: `/workspaces/clone/${workspaceId}`,
  })
}
