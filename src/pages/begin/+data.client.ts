import type { PageContextClient } from 'vike/types'
import { dataErrorHandler } from '@helpers/dataErrorHandler'
import { fetchWorkspacesCount } from '@/services/workspace'
import { redirect } from 'vike/abort'
import { requireAuth } from '../guards'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    await requireAuth()

    const workspaceCount = await fetchWorkspacesCount()

    if (workspaceCount > 0) {
      throw redirect('/workspace')
    }
  } catch (e) {
    dataErrorHandler(pageContext, e)
  }
}
