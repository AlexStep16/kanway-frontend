import { apiCall } from '@/apiClient'
import { Workspace } from '@interfaces/Workspace'

export async function getWorkspacesApi() {
  return await apiCall<Workspace[]>({
    method: 'GET',
    url: '/workspaces',
  })
}
