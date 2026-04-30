import type { PageContextClient } from 'vike/types'

export default (pageContext: PageContextClient) => {
  const { urlPathname } = pageContext

  const parts = urlPathname.split('/').filter(Boolean)

  return {
    routeParams: {
      step: parts[1] || '',
      payload: parts[2] || '',
    },
  }
}
