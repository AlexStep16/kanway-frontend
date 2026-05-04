export { route }

import { PageContextClient } from 'vike/types'
const routeRegex = /^\/workspace(?:\/([a-zA-Z0-9]+))?(?:\/([a-zA-Z0-9]+))?\/?$/

function route(pageContext: PageContextClient) {
  const match = pageContext.urlPathname.match(routeRegex)

  if (!match) return false

  const [, workspaceId, boardId] = match

  return {
    routeParams: { workspaceId: workspaceId || '', boardId: boardId || '' },
  }
}
