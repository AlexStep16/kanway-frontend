import type { PageContextClient } from 'vike/types'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { requireAuth, requireFinishedSignup } from '@/pages/guards'
import { handleWorkspaceRoute } from '@/helpers/handleWorkspaceRoute'
import { getWorkspaceRouter } from '../router'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireFinishedSignup()
    await requireAuth()

    const currentPath = pageContext.urlPathname

    const router = getWorkspaceRouter()
    const route = router.resolve(currentPath)
    console.log(route.params)
    return await handleWorkspaceRoute(
      (route.params.workspaceId as string) || null,
      (route.params.boardId as string) || null,
      currentPath,
    )
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
