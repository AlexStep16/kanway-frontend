import type { PageContextClient } from 'vike/types'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { redirectToWorkspace } from '@helpers/workspaceRoute'
import { useAuthStore } from '@/stores/auth'
import { getMe } from '@services/auth'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    const AUTH_STORE = useAuthStore(pageContext.pinia)

    AUTH_STORE.setUser(user)

    await redirectToWorkspace(pageContext)

    return {
      user,
    }
  } catch (e) {
    workspacesErrorRedirect(pageContext, e)
  }
}
