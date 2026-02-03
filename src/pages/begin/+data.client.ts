import type { PageContextClient } from 'vike/types'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { useAuthStore } from '@/stores/auth'
import { getMe } from '@services/auth'
import { fetchWorkspacesCount } from '@/services/workspace'
import { redirect } from 'vike/abort'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const authStore = useAuthStore(pageContext.pinia)

    const user = await getMe()

    authStore.setUser(user)

    const workspaceCount = await fetchWorkspacesCount()

    if (workspaceCount > 0) {
      throw redirect('/workspace')
    }
  } catch (e) {
    workspacesErrorRedirect(pageContext, e)
  }
}
