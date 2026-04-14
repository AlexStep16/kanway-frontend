import type { PageContextClient } from 'vike/types'
import { redirectToWorkspace } from '@helpers/workspaceRoute'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { requireAuth } from '@/pages/guards'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireAuth()

    await redirectToWorkspace(pageContext)
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
