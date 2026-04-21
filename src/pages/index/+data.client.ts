import { meApi } from '@/api/auth'
import { dataErrorHandler } from '@/helpers/dataErrorHandler'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  try {
    const user = await meApi()
    queryClient.setQueryData(userKeys.me, user)

    return { user }
  } catch (e: any) {
    if (e.status === 401 || e.response?.status === 401) {
      return { user: null }
    } else if (e.code === 404) {
      return null
    }

    return dataErrorHandler(pageContext, e)
  }
}
