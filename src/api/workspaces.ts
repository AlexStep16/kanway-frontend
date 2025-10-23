import { apiCall } from '@/apiClient'
import { CRUDResponse } from '@/interfaces/CRUDResponse'
import { Workspace } from '@interfaces/Workspace'

export async function getWorkspacesApi() {
  return await apiCall<Workspace[]>({
    method: 'GET',
    url: '/workspaces',
  })
}

export async function postWorkspaceApi(workspace: Partial<Workspace>) {
  return await apiCall<CRUDResponse<Workspace>>({
    method: 'POST',
    url: `/workspaces`,
    data: workspace,
  })
}

export async function putWorkspaceApi(payload: Partial<Workspace> & { _id: string }) {
  return await apiCall<Workspace[]>({
    method: 'PUT',
    url: `/workspaces/${payload._id}`,
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
  return await apiCall<Workspace[]>({
    method: 'POST',
    url: `/workspaces/${workspaceId}/archive`,
  })
}

export async function cloneWorkspaceApi(workspaceId: string) {
  return await apiCall<CRUDResponse<Workspace>>({
    method: 'PUT',
    url: `/workspaces/clone/${workspaceId}`,
  })
}
