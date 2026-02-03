import type { PageContextClient } from 'vike/types'

export { data }

const data = async (pageContext: PageContextClient) => {
  return {
    token: pageContext.urlParsed.search.token,
  }
}
