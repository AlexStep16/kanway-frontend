import { mande } from "mande";
import { useRootStore } from '../stores/root';
import { useBoardStore } from '../stores/board';
import { useWorkspaceStore } from '../stores/workspace';
import { useCategoryStore } from "../stores/category";
import { Category } from "../Interfaces/Category";
import { Task } from "../Interfaces/Task";
import { Board } from "../Interfaces/Board";
import { Workspace } from "../Interfaces/Workspace";
import NotificationEntities from "../enums/NotificationEntitiesEnum";
import { nextTick, reactive, watch } from "vue";
import { useTaskStore } from "../stores/task";
import dayjs from "dayjs";
import * as userFunctions from '../helpers/user';

const baseApi = import.meta.env.VITE_SERVER_BASE_URL;

export async function getCategoriesWithTasks(board: Board) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!board || !board._id || !WORKSPACE_STORE.activeWorkspace) return;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/tasks/board/' + board._id).get() as any;

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
        description: 'Возникла ошибка при получении задач. Попробуйте повторить позже.'
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

export async function deletedCategories() {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace || !WORKSPACE_STORE.activeWorkspace._id) return;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/categories/deleted').get<any>()

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
        description: 'Возникла ошибка при получении удаленных категорий. Попробуйте повторить позже.'
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

export async function editCategory(category: Category, workspace_id: string) {
  const STORE = useRootStore();

  if (category.name) {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + workspace_id + '/categories/' + category._id)
      .put<any>({ category })

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

    return editResult;
  } else {

    return false;
  }
}

export async function updateCategories(categories: any[]) {
  const STORE = useRootStore();
  const BOARD_STORE = useBoardStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!BOARD_STORE.activeBoard || !WORKSPACE_STORE.activeWorkspace) return;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/categories').put<any>({ categories });
    const editResults = res.result;

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

    if (editResults && Array.isArray(editResults)) {
      for (const editResult of editResults) {
        if (editResult && editResult.result && editResult.result.modifiedCount > 0) {
          STORE.updateCurrentEntitiesByOpLogs(editResult.operation_logs);
        }
      }
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
        description: 'Возникла ошибка при обновлении категории. Попробуйте повторить позже.'
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

export function fillCategoriesWithBoards(categories: Category[]) {
  const STORE = useRootStore();

  categories.forEach((category: Category) => {
    let board = STORE.allEntities.boards.find((board: Board) => board._id === category.board_id);
    if (!board) board = STORE.deletedEntities.boards.find((board: Board) => board._id === category.board_id);
    const workspace = STORE.allEntities.workspaces.find((workspace: Workspace) => board && workspace._id === board.workspace_id);

    category.board_name = board?.name;
    category.workspace_name = workspace?.name;
    category.workspace_id = workspace?._id;
  });

  return categories;
}

export function recoverCategory(category: Category) {
  const STORE = useRootStore();

  if (!category) return;

  category.is_deleted = false;

  const categoryBoard = STORE.allEntities.boards.find(board => board._id === category.board_id);

  if (STORE.allEntities.boards.find(board => board._id === category.board_id)?.isFilled || !categoryBoard) {
    prepareRawCategories([category]);
  }

  removeFromDeletedEntities(category);
}

export async function addCategory(category: Category, workspace_id: string) {
  const STORE = useRootStore();

  if (category.name) {

    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + workspace_id + '/categories').post<any>({ category })

    const data = res.result;

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return {
        mode: "add",
        success: false
      };
    }

    if (!data) return {
      mode: "add",
      success: false
    };

    return {
      mode: "add",
      data,
      success: true
    };
  } else {
    return {
      mode: "add",
      success: false
    };
  }
}

export function addCategoriesToDeletedEntities(category: Category) {
  const STORE = useRootStore();

  if (!category) return;

  STORE.deletedEntities.categories.unshift(fillCategoriesWithBoards([category])[0]);

  removeFromMainEntities(category);
}

export function getPreparedTask(task: Task) {
  const STORE = useRootStore();
  const TASK_STORE = useTaskStore();

  if (task.due_date) {
    task.due_date = dayjs.utc(task.due_date).tz(STORE.timezone).toDate();
  }

  if (!task.color) {
    task.color = '';
  }

  if (!task.is_completed) {
    task.is_completed = false;
  }

  if (!task.tags) {
    task.tags = [];
  }

  task.isTaskUpdating = false;

  const preparedTask = reactive(task);

  watch(preparedTask, (newTask: Task) => {
    nextTick(() => {
      TASK_STORE.resizeTextarea(newTask);
    })
  })

  return preparedTask;
}

export function prepareRawCategories(data: Array<any>) {
  const STORE = useRootStore();

  STORE.allEntities.categories.push(...data
    .map((category: Category) => {
      category.isNameInputShown = false;
      category.isCategoryUpdating = false;
      category.addTaskButtonRef = reactive({
        value: null
      });

      category.sorting = {
        type: null,
        up: null
      }

      if (category.tasks) category.tasks = category.tasks
        .map((task: Task) => getPreparedTask(task))
        .sort((a: Task, b: Task) => a.order - b.order);
      else category.tasks = [];

      return {
        ...category,
        isMenuOpened: false,
        isSortMenuOpened: false
      };
    })
    .sort((a: Category, b: Category) => a.order - b.order)
  );
}

export async function cloneCategory() {
  const STORE = useRootStore();
  const CATEGORY_STORE = useCategoryStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const BOARD_STORE = useBoardStore();

  if (!CATEGORY_STORE.selectedCategory || !STORE.allEntities.categories || !WORKSPACE_STORE.activeWorkspace) return;

  CATEGORY_STORE.closeMenus();

  const selectedCategory = CATEGORY_STORE.selectedCategory;

  selectedCategory.isCategoryUpdating = true;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/categories/clone/' + selectedCategory?._id)
      .put<any>({ count: STORE.allEntities.categories.filter(cat => BOARD_STORE.activeBoard && cat.board_id === BOARD_STORE.activeBoard._id).length })

    const result = res.result;

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      selectedCategory.isCategoryUpdating = false;

      return;
    }

    if (result && STORE.allEntities.categories) {
      const newCategory = result.category;

      newCategory.tasks = result.tasks ?? [];

      prepareRawCategories([newCategory]);
    }

    selectedCategory.isCategoryUpdating = false;
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
        description: 'Возникла ошибка при копировании категории. Попробуйте повторить позже.'
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

export async function deleteCategory() {
  const STORE = useRootStore();
  const CATEGORY_STORE = useCategoryStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  CATEGORY_STORE.closeMenus();

  if (!WORKSPACE_STORE.activeWorkspace) return;

  if (CATEGORY_STORE.selectedCategory) {
    const selectedCategory = CATEGORY_STORE.selectedCategory;

    selectedCategory.isCategoryUpdating = true;
    try {
      const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/categories/' + selectedCategory?._id).delete<any>()
      const deleteResult = res.result;

      if (!res || !res.success) {
        STORE.createNotification({
          action_type: 'error',
          description: res.error.description
        });

        if (res.error.code === 54) {
          return await userFunctions.logout();
        }

        selectedCategory.isCategoryUpdating = false;

        return false;
      }

      if (deleteResult && deleteResult.result && deleteResult.result.modifiedCount !== 0) {
        STORE.updateCurrentEntitiesByOpLogs(deleteResult.operation_logs);
      }

      addCategoriesToDeletedEntities(selectedCategory);

      STORE.createNotification({
        _id: selectedCategory._id,
        action_type: 'success',
        entity_type: NotificationEntities.Category,
        description: `Категория ${selectedCategory.name} успешно удалена!`,
        hasCancel: true
      });

      selectedCategory.isCategoryUpdating = false;

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
          description: 'Возникла ошибка при удалении категории. Попробуйте повторить позже.'
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
}

export function removeFromDeletedEntities(category: Category) {
  const STORE = useRootStore();

  STORE.deletedEntities.categories.splice(STORE.deletedEntities.categories.indexOf(category), 1);
  STORE.deletedEntities.tasks = STORE.deletedEntities.tasks.filter(t => t.category_id !== category._id);
}

export async function removeFromMainEntities(category: Category) {
  const STORE = useRootStore();

  STORE.allEntities.categories.splice(STORE.allEntities.categories.indexOf(category), 1);
}

export function categoryWithTask(task: Task) {
  const STORE = useRootStore();
  let newTask: any = task;

  if (!task.category_id && task._id) {
    STORE.allEntities.categories.forEach((category: Category) => {
      category.tasks.forEach((t: Task) => {
        if (t._id = task._id) newTask = t;
      })
    })
  }

  STORE.allEntities.categories.forEach((category: Category) => {
    if (category._id === newTask.category_id) {
      category.tasks.push(newTask)
    }
  })
}