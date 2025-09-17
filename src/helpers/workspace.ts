import { mande } from "mande";
import { useRootStore } from '../stores/root';
import { useWorkspaceStore } from '../stores/workspace';
import { Workspace } from "../Interfaces/Workspace";
import * as userFunctions from '../helpers/user';
import NotificationEntities from "../enums/NotificationEntitiesEnum";

const baseApi = import.meta.env.VITE_SERVER_BASE_URL;

export async function deletedWorkspaces() {
  const STORE = useRootStore();

  try {
    const res = await mande(baseApi + '/workspaces/deleted').get<any>()

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
        description: 'Возникла ошибка при получении удаленных пространств. Попробуйте повторить позже.'
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

export async function workspaces() {
  const STORE = useRootStore();

  try {
    const res = await mande(baseApi + '/workspaces').get<any>()

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
        description: 'Возникла ошибка при получении пространств. Попробуйте повторить позже.'
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

export async function createWorkspace(workspace: object) {
  const STORE = useRootStore();

  try {
    const res = await mande(baseApi + '/workspaces').post<any>({ workspace })

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return {};
    }

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

        return false;
      }

      STORE.createNotification({
        action_type: 'error',
        description: 'Возникла ошибка при создании пространства. Попробуйте повторить позже.'
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

export async function addWorkspaceToDeletedEntities(workspace: Workspace) {
  const STORE = useRootStore();

  STORE.deletedEntities.workspaces.unshift(workspace);

  await removeFromMainEntities(workspace);
}

export async function workspace(selectedWorkspace: Workspace) {
  const STORE = useRootStore();

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspaces/clone/' + selectedWorkspace._id).put<any>()

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
        description: 'Возникла ошибка при копировании пространства. Попробуйте повторить позже.'
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

export async function setWorkspaceFavorite(workspace: Workspace | null) {
  const STORE = useRootStore();

  if (!workspace) return;

  workspace.isMenuOpened = false;

  await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspaces/' + workspace._id)
    .put<any>({ workspace: { ...workspace, is_favorite: !workspace.is_favorite } })
    .then(async res => {
      if (!res || !res.success) {
        STORE.createNotification({
          action_type: 'error',
          description: res.error.description
        });

        if (res.error.code === 54) {
          return await userFunctions.logout();
        }

        return;
      }

      workspace.is_favorite = !workspace.is_favorite;
    });
}

export function recoverWorkspace(workspace: Workspace) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!workspace) return;

  STORE.allEntities.workspaces.push(workspace)

  if (STORE.allEntities.workspaces.length === 1) WORKSPACE_STORE.selectWorkspace(workspace, true);

  removeFromDeletedEntities(workspace);
}

export async function deleteWorkspace(): Promise<boolean> {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.selectedWorkspace) return false;

  if (STORE.allEntities.workspaces.length === 1) {
    STORE.createNotification({
      action_type: 'error',
      description: "Вы не можете удалить единственное пространство"
    });

    return false;
  }

  const selectedWorkspace = WORKSPACE_STORE.selectedWorkspace;

  selectedWorkspace.isWorkspaceUpdating = true;

  const res: any = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspaces/' + selectedWorkspace._id).delete()
  const deleteResult = res.result;

  if (!res || !res.success) {
    STORE.createNotification({
      action_type: 'error',
      description: res.error.description
    });

    if (res.error.code === 54) {
      return await userFunctions.logout();
    }

    selectedWorkspace.isWorkspaceUpdating = false;

    return false;
  }

  if (deleteResult && deleteResult.result && deleteResult.result.modifiedCount !== 0) {
    STORE.updateCurrentEntitiesByOpLogs(deleteResult.operation_logs);
  }

  addWorkspaceToDeletedEntities(selectedWorkspace);

  selectedWorkspace.isWorkspaceUpdating = false;

  STORE.createNotification({
    _id: selectedWorkspace._id,
    action_type: 'success',
    entity_type: NotificationEntities.Workspace,
    description: `Пространство ${selectedWorkspace.name} успешно удалено!`,
    hasCancel: true
  });

  return true;
}

export function removeFromDeletedEntities(workspace: Workspace) {
  const STORE = useRootStore();

  STORE.deletedEntities.workspaces.splice(STORE.deletedEntities.workspaces.indexOf(workspace), 1);
  const boardsIdsToDelete = STORE.deletedEntities.boards.filter(b => b.workspace_id === workspace._id).map(b => b._id);

  STORE.deletedEntities.boards = STORE.deletedEntities.boards.filter(b => b.workspace_id !== workspace._id);
  const categoriesIdsToDelete = STORE.deletedEntities.categories.filter(c => boardsIdsToDelete.includes(c.board_id)).map(c => c._id);

  STORE.deletedEntities.tasks = STORE.deletedEntities.tasks.filter(t => !categoriesIdsToDelete.includes(t.category_id));
  STORE.deletedEntities.categories = STORE.deletedEntities.categories.filter(c => !boardsIdsToDelete.includes(c.board_id));
}

export async function removeFromMainEntities(workspace: Workspace) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  STORE.allEntities.workspaces = STORE.allEntities.workspaces.filter(w => w._id !== workspace._id);

  await WORKSPACE_STORE.switchWorkspaceAfterChange(workspace);
}