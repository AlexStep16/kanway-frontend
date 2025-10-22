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

export async function putWorkspaceApi(workspace: Workspace) {
  return await apiCall<Workspace[]>({
    method: 'PUT',
    url: `/workspaces/${workspace._id}`,
    data: workspace,
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
