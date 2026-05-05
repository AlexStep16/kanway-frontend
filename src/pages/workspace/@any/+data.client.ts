import { PageContextClient } from 'vike/types'
import { resolveRoute } from 'vike/routing'
import { requireAuth, requireFinishedSignup } from '@/pages/guards'
import { handleWorkspaceRoute } from '@/helpers/handleWorkspaceRoute'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const { routeParams } = resolveRoute(
      '/workspace/@workspaceId/@boardId',
      pageContext.urlPathname,
    )
    const { workspaceId, boardId } = routeParams

    await requireFinishedSignup()
    await requireAuth()

    const currentPath = pageContext.urlPathname

    return await handleWorkspaceRoute(workspaceId, boardId, currentPath)
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
