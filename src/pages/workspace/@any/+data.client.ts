import { PageContext } from "vike/types"
import { resolveRoute } from 'vike/routing'

export async function data(pageContext: PageContext) {
  const { routeParams } = resolveRoute('/workspace/@workspaceId/@boardId', pageContext.urlPathname);
  const { workspaceId, boardId } = routeParams
  console.log(routeParams)

  return {
    workspaceId,
    boardId,
  }
}