import { mande } from "mande";
import { redirect, render } from "vike/abort";
import { PageContextClient } from "vike/types";
import { Workspace } from "../Interfaces/Workspace";
import { Board } from "../Interfaces/Board";
import { WorkspaceRouteHandler } from "./WorkspaceRouteHandler";

function getParsedItemFromLocalStorage<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const item = localStorage.getItem(key);

  if (!item) {
    return null;
  }

  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing localStorage item with key "${key}":`, error);
    return null;
  }
}

export async function redirectToWorkspace(pageContext: PageContextClient) {
  try {
    if ('isSkipWorkspaceCheck' in pageContext && pageContext.isSkipWorkspaceCheck) return;

    const params = pageContext.routeParams;

    const workspacesResult = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspaces', {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    }).get<any>();

    if (!workspacesResult || !workspacesResult.success) {
      throw render(500);
    }

    if (workspacesResult.result?.length === 0) {
      throw redirect('/begin');
    }

    const workspaceInWorkspaces = params.workspaceId ? workspacesResult.result.find((workspace: Workspace) => workspace._id === params.workspaceId) : null;

    const parsedWorkspace: Workspace | null = getParsedItemFromLocalStorage<Workspace>('selectedWorkspace');
    let selectedWorkspace: Workspace | null = null;

    if (parsedWorkspace && !workspaceInWorkspaces) {
      selectedWorkspace = workspacesResult.result.find((workspace: Workspace) => workspace._id === parsedWorkspace?._id) ?? workspacesResult.result[0];
    } else if (!workspaceInWorkspaces) {
      selectedWorkspace = workspacesResult.result[0];
    }

    const parsedBoard: Board | null = getParsedItemFromLocalStorage<Board>('selectedBoard');
    let selectedBoard: Board | null = null;

    if (workspaceInWorkspaces) {
      selectedWorkspace = workspaceInWorkspaces;
    }

    if (selectedWorkspace && typeof selectedWorkspace === 'object') {
      const boardsResult = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + selectedWorkspace._id + '/boards', {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        }
      }).get<any>();

      if (boardsResult.result.length > 0 ) {
        const boardInWorkspace = params.boardId ? boardsResult.result.find((board: Board) => board._id === params.boardId) : null;

        if (parsedBoard && !boardInWorkspace) {
          selectedBoard = boardsResult.result.find((board: Board) => board._id === parsedBoard._id) ?? null;
        }

        if (typeof params.boardId === 'string' && params.boardId.length > 0 && boardInWorkspace) {
          selectedBoard = boardInWorkspace;
        }
      }
    }

    if (workspaceInWorkspaces && params.workspaceId && !params.boardId) return;

    const router = new WorkspaceRouteHandler(selectedBoard, selectedWorkspace);
    await router.handleRoute(params.boardId, params.workspaceId, workspacesResult.result.length);
  } catch (e: any) {
    if (e instanceof Error && e.message.includes('AbortRender')) {
      throw e;
    }

    console.error("Error in redirectToWorkspace:", e); // Add logging
    throw render(500);
  }
}