import type { PageContextClient } from 'vike/types'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { redirectToWorkspace } from '@helpers/workspaceRoute'
import { useAuthStore } from '@/stores/auth'
import { getMe } from '@services/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const authStore = useAuthStore(pageContext.pinia)

    const user = await getMe()

    authStore.setUser(user)

    await redirectToWorkspace(pageContext)
  } catch (e) {
    workspacesErrorRedirect(pageContext, e)
  }
}
