import type { PageContextClient } from 'vike/types'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { requireAuth, requireFinishedSignup } from '@/pages/guards'
import { handleWorkspaceRoute } from '@/helpers/handleWorkspaceRoute'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireFinishedSignup()
    await requireAuth()

    const { workspaceId: urlWorkspaceId, boardId: urlBoardId } = pageContext.routeParams
    const currentPath = pageContext.urlPathname

    return await handleWorkspaceRoute(urlWorkspaceId, urlBoardId, currentPath)
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
