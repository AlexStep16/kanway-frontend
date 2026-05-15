import { fetchWorkspacesCount } from '~/services/workspace'

export default defineNuxtRouteMiddleware(async () => {
  const workspaceCount = await fetchWorkspacesCount()

  if (workspaceCount > 0) {
    return navigateTo('/workspace')
  }
})
