import type { PageContextClient } from "vike/types";
import User from "../../../../Interfaces/User";
import { mande } from "mande";
import { redirect } from "vike/abort";
import { redirectToWorkspace } from "../../../../helpers/workspaceRoute";

export { data }

const data = async (pageContext: PageContextClient) => {
  const user: User | null = null;
  /*try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/auth/check', {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    }).get<any>();
    
    if (!res.success) {
      if (res.status === 403) {
        throw redirect('/confirmation');
      } else {
        throw redirect('/sign-in');
      }
    }

    user = res;
  } catch (e: any) {
    if (e instanceof Error && e.message.includes('AbortRender')) {
      throw e;
    }

    throw redirect('/sign-in');
  }
  
  await redirectToWorkspace(pageContext);

  return {
    boardId: pageContext.routeParams.boardId,
    workspaceId: pageContext.routeParams.workspaceId,
    user
  }*/
};