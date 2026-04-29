import { redirect } from 'vike/abort'
import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  const token = pageContext.urlParsed.search.token

  if (!token) {
    throw redirect('/auth')
  }

  return { token }
}
