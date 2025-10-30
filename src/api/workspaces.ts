import { apiCall } from '@/apiClient'
import { CRUDResponse } from '@interfaces/CRUDResponse'
import IWorkspace from '@models/WorkspaceModel'
import IBoard from '@models/BoardModel'

export async function getWorkspacesApi() {
  return await apiCall<IWorkspace[]>({
    method: 'GET',
    url: '/workspaces',
  })
}

export async function postWorkspaceApi(payload: Partial<IBoard>) {
  return await apiCall<CRUDResponse<IWorkspace>>({
    method: 'POST',
    url: `/workspaces`,
    data: payload,
  })
}

export async function putWorkspaceApi(workspaceId: string, payload: Partial<IBoard>) {
  return await apiCall<IWorkspace[]>({
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
  return await apiCall<IWorkspace[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/archive`,
  })
}

export async function cloneWorkspaceApi(workspaceId: string) {
  return await apiCall<CRUDResponse<IWorkspace>>({
    method: 'PUT',
    url: `/workspaces/clone/${workspaceId}`,
  })
}
