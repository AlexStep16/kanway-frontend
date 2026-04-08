import type { PageContextClient } from 'vike/types'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { redirectToWorkspace } from '@helpers/workspaceRoute'
import { getMe } from '@services/auth'
import { queryClient } from '@/plugins/queryClient'
import { userKeys } from '@/keys'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await getMe()

    queryClient.setQueryData(userKeys.me, user)

    await redirectToWorkspace(pageContext)
  } catch (e) {
    workspacesErrorRedirect(pageContext, e)
  }
}
