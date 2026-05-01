import type { PageContextClient } from 'vike/types'

export default (pageContext: PageContextClient) => {
  const { urlPathname } = pageContext

  if (!urlPathname.startsWith('/auth')) {
    return false
  }

  const parts = urlPathname.split('/').filter(Boolean)

  return {
    routeParams: {
      step: parts[1] || '',
      payload: parts[2] || '',
    },
  }
}
