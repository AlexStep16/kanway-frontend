import type { PageContextClient } from 'vike/types'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { redirectToWorkspace } from '@helpers/workspaceRoute'
import { getMe } from '@services/auth'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'

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
