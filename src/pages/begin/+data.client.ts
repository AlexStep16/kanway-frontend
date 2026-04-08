import type { PageContextClient } from 'vike/types'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { getMe } from '@services/auth'
import { fetchWorkspacesCount } from '@/services/workspace'
import { redirect } from 'vike/abort'
import { queryClient } from '@/plugins/queryClient'
import { userKeys } from '@/keys'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    queryClient.setQueryData(userKeys.me, user)

    const workspaceCount = await fetchWorkspacesCount()

    if (workspaceCount > 0) {
      throw redirect('/workspace')
    }
  } catch (e) {
    workspacesErrorRedirect(pageContext, e)
  }
}
