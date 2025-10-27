import type { PageContextClient } from 'vike/types'
import { meAuthApi } from '@api/auth'
import { workspacesErrorRedirect } from '@helpers/workspacesErrorRedirect'
import { redirectToWorkspace } from '@helpers/workspaceRoute'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await meAuthApi()

    await redirectToWorkspace(pageContext)

    return {
      workspaceId: pageContext.routeParams.workspaceId,
      user,
    }
  } catch (e) {
    workspacesErrorRedirect(pageContext, e)
  }
}
