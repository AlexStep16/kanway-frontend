import { getWorkspacesApi } from '@api/workspaces'

export async function fetchWorkspaces() {
  const workspaces = await getWorkspacesApi()

  return workspaces
}
