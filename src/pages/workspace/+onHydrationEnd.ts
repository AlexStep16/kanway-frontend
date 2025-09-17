export { onHydrationEnd }

import type { OnHydrationEndAsync } from 'vike/types'
import { mande } from 'mande';
import { redirectToWorkspace } from '../../helpers/workspaceRoute';
import { navigate } from 'vike/client/router';
import initHydrationEnd from '../../helpers/initHydrationEnd';

const onHydrationEnd: OnHydrationEndAsync = async (
  pageContext
): ReturnType<OnHydrationEndAsync> => {/*
  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/auth/check', {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    }).get<any>();

    if (!res.success) {
      if (res.status === 403) {
        return await navigate('/confirmation', { overwriteLastHistoryEntry: true });
      } else {
        return await navigate('/sign-in', { overwriteLastHistoryEntry: true });
      }
    }

    await redirectToWorkspace(pageContext);

    initHydrationEnd();
  } catch (e: any) {
    if (e instanceof Error && e.message.includes('AbortRender')) {
      throw e;
    }

    return await navigate('/sign-in', { overwriteLastHistoryEntry: true });
  }*/
}