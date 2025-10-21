import { apiCall } from '@/apiClient'
import { AddResponse } from '@interfaces/AddResponse'
import { Workspace } from '@interfaces/Workspace'

export async function getWorkspacesApi() {
  return await apiCall<Workspace[]>({
    method: 'GET',
    url: '/workspaces',
  })
}

export async function postWorkspaceApi(workspace: Partial<Workspace>) {
  return await apiCall<AddResponse<Workspace>>({
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
