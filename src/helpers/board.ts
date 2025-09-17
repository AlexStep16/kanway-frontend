import { mande, MandeError } from "mande";
import { useRootStore } from '../stores/root';
import { useWorkspaceStore } from '../stores/workspace';
import { useBoardStore } from '../stores/board';
import { Workspace } from "../Interfaces/Workspace";
import { Board } from "../Interfaces/Board";
import NotificationEntities from "../enums/NotificationEntitiesEnum";
import * as userFunctions from '../helpers/user';

const baseApi = import.meta.env.VITE_SERVER_BASE_URL;

export async function deletedBoards() {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace || !WORKSPACE_STORE.activeWorkspace._id) return;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards/deleted').get<any>()

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return false;
    }

    return res.result ?? [];
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при получении удаленных досок. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return false;
  }
}

export async function boards(workspace_id: string): Promise<Board[]> {
  const STORE = useRootStore();
  const workspace = STORE.allEntities.workspaces.find((w: Workspace) => w._id === workspace_id);

  if (!workspace || !workspace._id || workspace.isFilled) return [];
  try {
    const res = await mande(baseApi + '/workspace/' + workspace_id + '/boards').get<any>()

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return [];
    }

    workspace.isFilled = true;

    return res.result;
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return [];
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при получении досок. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return [];
  }
}

export async function editBoardApi(board: any) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!board || !WORKSPACE_STORE.activeWorkspace) return;

  return mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards/' + board._id)
    .put<any>({ board })
    .then(async res => {
      const editResult = res.result;

      if (!res || !res.success) {
        STORE.createNotification({
          action_type: 'error',
          description: res.error.description
        });

        if (res.error.code === 54) {
          return await userFunctions.logout();
        }

        return false;
      }

      if (editResult && editResult.result && editResult.result.modifiedCount > 0) {
        STORE.updateCurrentEntitiesByOpLogs(editResult.operation_logs);
      }

      return true;
    }).catch((e: MandeError) => {
      if (e.body && e.response.status === 422 && e.body.length > 0) {
        for (const error of e.body) {
          STORE.createNotification({
            action_type: 'error',
            description: error.description
          });
        }
      }
    });
}

export function fillBoardsWithWorkspace(boards: Board[]) {
  const STORE = useRootStore();

  boards.forEach((board: Board) => {
    board.workspace_name = STORE.allEntities.workspaces.find((workspace: Workspace) => workspace._id === board.workspace_id)?.name;
  });

  return boards;
}

export function recoverBoard(board: Board) {
  const STORE = useRootStore();
  const BOARD_STORE = useBoardStore();

  if (!board) return;

  STORE.allEntities.boards.push(board)

  if (STORE.allEntities.boards.length === 1) BOARD_STORE.selectBoard(board);

  removeFromDeletedEntities(board);
}

export async function transferBoard(workspace: Workspace, board: Board) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace) return;

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards/' + board._id + '/transfer/' + workspace._id)
      .put<any>()

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return false;
    }

    return true;
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при перемещении доски. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return false;
  }
}

export async function cloneBoard(board?: Board) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const BOARD_STORE = useBoardStore();

  if (!WORKSPACE_STORE.activeWorkspace || (!board && !BOARD_STORE.activeBoard)) return;

  const boardToClone = board ? board : BOARD_STORE.activeBoard;

  if (!boardToClone) return;

  boardToClone.isUpdating = true;

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards/clone/' + boardToClone._id)
      .put<any>()

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      boardToClone.isUpdating = false;

      return false;
    }

    STORE.allEntities.boards.push(res.result.board);
    STORE.allEntities.categories.push(res.result.categories);

    boardToClone.isUpdating = false;

    const availableBoards = STORE.allEntities.boards;

    if (availableBoards && availableBoards.length > 0) BOARD_STORE.selectBoard(availableBoards[availableBoards.length - 1], true);

    return true;
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при копировании доски. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return false;
  }
}

export async function addBoard(board: { name: string }) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace) return false;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards')
      .post<any>({ board });

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return false;
    }

    return res.result;
  } catch (e: any) {
    if (e.body && e.response.status === 422 && e.body.length > 0) {
      for (const error of e.body) {
        STORE.createNotification({
          action_type: 'error',
          description: error.description
        });
      }
    }

    return false;
  }
}

export async function addBoardsToDeletedEntities(board: Board) {
  const STORE = useRootStore();

  STORE.deletedEntities.boards.unshift(fillBoardsWithWorkspace([board])[0]);

  removeFromMainEntities(board);
}

export async function deleteBoard(board: Board) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace || !board) return;

  board.isUpdating = true;

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards/' + board._id).delete<any>();
    const deleteResult = res.result;

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      board.isUpdating = false;

      return false;
    }

    if (deleteResult && deleteResult.result && deleteResult.result.modifiedCount !== 0) {
      STORE.updateCurrentEntitiesByOpLogs(deleteResult.operation_logs);
    }

    addBoardsToDeletedEntities(board);

    board.isUpdating = false;

    STORE.createNotification({
      _id: board._id,
      action_type: 'success',
      entity_type: NotificationEntities.Board,
      description: `Доска ${board.name} успешно удалена!`,
      hasCancel: true
    });

    board.is_deleted = true;

    return true;
  } catch (error: any) {
    if (error.response && error.response.status !== 200) {
      if (error.body && error.body.length > 0) {
        for (const e of error.body) {
          STORE.createNotification({
            action_type: 'error',
            description: e.description
          });
        }

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при удалении доски. Попробуйте повторить позже.'
      });
    } else {
      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
      });
    }

    return false;
  }
}

export function removeFromDeletedEntities(board: Board) {
  const STORE = useRootStore();

  STORE.deletedEntities.boards.splice(STORE.deletedEntities.boards.indexOf(board), 1)
  const categoriesIdsToDelete = STORE.deletedEntities.categories.filter(c => c.board_id === board._id).map(c => c._id);

  STORE.deletedEntities.tasks = STORE.deletedEntities.tasks.filter(t => !categoriesIdsToDelete.includes(t.category_id));
  STORE.deletedEntities.categories = STORE.deletedEntities.categories.filter(c => c.board_id !== board._id);
}

export async function removeFromMainEntities(board: Board) {
  const STORE = useRootStore();
  const BOARD_STORE = useBoardStore();

  STORE.allEntities.boards = STORE.allEntities.boards.filter(b => b._id !== board._id);

  await BOARD_STORE.switchBoardAfterChange(board);
}