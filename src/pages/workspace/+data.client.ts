import type { PageContextClient } from 'vike/types'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { requireAuth, requireFinishedSignup } from '@/pages/guards'
import { handleWorkspaceRoute } from '@/helpers/handleWorkspaceRoute'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireFinishedSignup()
    await requireAuth()

    const currentPath = pageContext.urlPathname
    console.log(currentPath)
    return await handleWorkspaceRoute(null, null, currentPath)
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
