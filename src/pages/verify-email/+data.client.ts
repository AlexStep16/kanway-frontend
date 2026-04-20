import { meApi } from '@/api/auth'
import { redirect } from 'vike/abort'
import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  const token = pageContext.urlParsed.search.token

  try {
    const user = await meApi()

    if (user.isConfirmed) {
      throw redirect('/workspace')
    }
  } catch (e: any) {
    if ((e.status === 401 || e.response?.status === 401) && !token) {
      throw redirect('/sign-in')
    }
  }

  return { token }
}
