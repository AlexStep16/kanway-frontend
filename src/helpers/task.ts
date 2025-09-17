import { mande, MandeError } from "mande";
import { useRootStore } from '../stores/root';
import { useWorkspaceStore } from '../stores/workspace'
import { useBoardStore } from '../stores/board'
import { useCategoryStore } from "../stores/category";
import { useTaskStore } from "../stores/task";
import { Task } from "../Interfaces/Task";
import { Category, SortingType } from "../Interfaces/Category";
import { Board } from "../Interfaces/Board";
import { Workspace } from "../Interfaces/Workspace";
import NotificationEntities from "../enums/NotificationEntitiesEnum";
import dayjs from "dayjs";
import * as userFunctions from '../helpers/user';

const baseApi = import.meta.env.VITE_SERVER_BASE_URL;

export async function deletedTasks() {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace) return;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/tasks/deleted').get() as any;

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
        description: 'Возникла ошибка при получении удаленных задач. Попробуйте повторить позже.'
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

export function dateFilter(task: Task) {
  const STORE = useRootStore();
  const taskDate = dayjs(task.due_date, 'DD.MM.YYYY HH:mm', true);

  let isDateSuitable = false;
  let dateFiltersCount = 0;

  if (STORE.filter.date.includes('expired')) {
    dateFiltersCount++;
    if (taskDate < dayjs.utc() && !task.is_completed) isDateSuitable = true;
  }

  if (STORE.filter.date.includes('progress')) {
    dateFiltersCount++;
    if (taskDate > dayjs.utc()) isDateSuitable = true;
  }

  if (STORE.filter.date.includes('none')) {
    dateFiltersCount++;
    if (!taskDate.isValid()) isDateSuitable = true;
  }

  if (dateFiltersCount === 0) isDateSuitable = true

  return { isDateSuitable, dateFiltersCount };
}

export function filterTags(task: Task) {
  const STORE = useRootStore();
  let isTagsSuitable = false;
  let tagsFiltersCount = 0;

  if (STORE.filter.tags.items.length > 0 || STORE.filter.tags.hasTags === false) {
    tagsFiltersCount++;

    task.tags.forEach(tag => {
      if (STORE.filter.tags.items.includes(tag)) isTagsSuitable = true;
    })

    if (!STORE.filter.tags.hasTags && task.tags.length === 0) {
      isTagsSuitable = true;
    }
  }

  if (tagsFiltersCount === 0) isTagsSuitable = true;

  return { isTagsSuitable, tagsFiltersCount };
}

export function getSortedTasks(tasks: Task[], sorting: any) {
  const TASK_STORE = useTaskStore();

  const filteredTasks = tasks.filter(task => {
    const { isDateSuitable, dateFiltersCount } = dateFilter(task);
    const { isTagsSuitable, tagsFiltersCount } = filterTags(task);

    const isSuitable = isDateSuitable && isTagsSuitable;
    const filtersCount = dateFiltersCount + tagsFiltersCount;

    if (filtersCount === 0) return true;

    return isSuitable;
  });

  TASK_STORE.filteredTasksCount = filteredTasks.length;

  return [...filteredTasks].sort((a: Task, b: Task) => {
    if (!sorting) return a.order - b.order;
    if (!a._id || !b._id) return 1;

    if (sorting.type === SortingType.Date) {
      if (a.createdAt === b.createdAt) return a.order - b.order;

      if (sorting.up) {
        return a.createdAt > b.createdAt ? 1 : -1;
      } else {
        return a.createdAt < b.createdAt ? 1 : -1;
      }
    }

    if (sorting.type === SortingType.ExpireDate) {
      const aDate = dayjs(a.due_date, 'DD.MM.YYYY HH:mm', true);
      const bDate = dayjs(b.due_date, 'DD.MM.YYYY HH:mm', true);

      if (a.due_date?.getTime() === b.due_date?.getTime() || !aDate.isValid() || !bDate.isValid()) return a.order - b.order;

      if (sorting.up) {
        return aDate > bDate ? 1 : -1;
      } else {
        return aDate > bDate ? -1 : 1;
      }
    }

    if (sorting.type === SortingType.Name) {
      if (a.name === b.name) return a.order - b.order;

      if (sorting.up) {
        return a.name > b.name ? 1 : -1;
      } else {
        return a.name < b.name ? 1 : -1;
      }
    }

    return a.order - b.order;
  })
}

export function isTaskColorShown(task: any) {
  return Boolean(task.color)
};

export async function createTask(task: Task) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace) return false;

  const preparedTask = { ...task };

  delete preparedTask.refInputElement;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/tasks').post<any>({ task: preparedTask });
    const newTask = res.result;

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

    task._id = newTask._id;

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
        description: 'Возникла ошибка при создании задачи. Попробуйте повторить позже.'
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

export function addTaskToDeletedEntities(task: Task, category: Category) {
  const STORE = useRootStore();

  if (!task) return;

  STORE.deletedEntities.tasks.unshift(fillTasksWithCategories([task])[0]);

  removeFromMainEntities(task, category);
}

export async function deleteTask(task: Task) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const TASK_STORE = useTaskStore();
  const CATEGORY_STORE = useCategoryStore();

  if (!WORKSPACE_STORE.activeWorkspace || !task || !TASK_STORE.selectedTask) return;

  const selectedTask = TASK_STORE.selectedTask;
  const selectedCategory = CATEGORY_STORE.selectedCategory;

  TASK_STORE.showEditTask = false;

  selectedTask.isTaskUpdating = true;

  if (task._id !== "") {
    mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/tasks/' + task._id)
      .delete<any>()
      .then(async res => {
        const deleteResult = res.result;

        if (!res || !res.success) {
          STORE.createNotification({
            action_type: 'error',
            description: res.error.description
          });

          if (res.error.code === 54) {
            return await userFunctions.logout();
          }

          selectedTask.isTaskUpdating = false;

          return;
        }

        if (deleteResult && deleteResult.result && deleteResult.result.modifiedCount !== 0) {
          STORE.updateCurrentEntitiesByOpLogs(deleteResult.operation_logs);
        }

        addTaskToDeletedEntities(task, selectedCategory as Category);

        STORE.createNotification({
          _id: selectedTask._id,
          action_type: 'success',
          entity_type: NotificationEntities.Task,
          description: `Задача ${selectedTask.name} успешно удалена!`,
          hasCancel: true
        });

        selectedTask.is_deleted = true;
      }).catch((e: MandeError) => {
        if (e.body && e.response.status === 422 && e.body.length > 0) {
          for (const error of e.body) {
            STORE.createNotification({
              action_type: 'error',
              description: error.description
            });
          }
        } else {
          STORE.createNotification({
            action_type: 'error',
            description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
          });
        }
      }).finally(() => {
        selectedTask.isTaskUpdating = false;
      });
  } else {
    selectedTask.isTaskUpdating = false;

    STORE.createNotification({
      action_type: 'error',
      description: "Задача не найдена."
    });
  }
}

export function removeFromDeletedEntities(task: Task) {
  const STORE = useRootStore();

  STORE.deletedEntities.tasks.splice(STORE.deletedEntities.tasks.indexOf(task), 1);
}

export async function removeFromMainEntities(task: Task, category: Category) {
  category?.tasks.splice(category.tasks.indexOf(task), 1);
}

export async function updateTask(task: Task) {
  const STORE = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace) return false;

  try {
    const res: any = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/tasks/' + task._id)
      .put({ task, timezone: STORE.timezone });
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
  } catch (error: any) {
    console.error(error);
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
        description: 'Возникла ошибка при создании задачи. Попробуйте повторить позже.'
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

export function fillTasksWithWorkspaces(tasks: Task[]) {
  const STORE = useRootStore();

  tasks.forEach((task: Task) => {
    let board = STORE.allEntities.boards.find((board: Board) => task && board._id === task.board_id);
    if (!board) {
      board = STORE.deletedEntities.boards.find((board: Board) => task && board._id === task.board_id);
    }

    const workspace = STORE.allEntities.workspaces.find(
      (workspace: Workspace) => board && workspace._id === board.workspace_id
    );

    if (task.due_date) {
      task.due_date = dayjs.utc(task.due_date).tz(STORE.timezone).toDate();
    }

    task.workspace_name = workspace?.name;
    task.workspace_id = workspace?._id;
  });

  return tasks;
}

export function fillTasksWithCategories(tasks: Task[]) {
  const STORE = useRootStore();

  tasks.forEach((task: Task) => {
    let category = STORE.allEntities.categories.find((category: Category) => category._id === task.category_id);
    if (!category) {
      category = STORE.deletedEntities.categories.find((category: Category) => category._id === task.category_id);
    }

    let board = STORE.allEntities.boards.find((board: Board) => category && board._id === category.board_id);
    if (!board) {
      board = STORE.deletedEntities.boards.find((board: Board) => category && board._id === category.board_id);
    }

    const workspace = STORE.allEntities.workspaces.find(
      (workspace: Workspace) => board && workspace._id === board.workspace_id
    );

    if (task.due_date) {
      task.due_date = dayjs.utc(task.due_date).tz(STORE.timezone).toDate();
    }

    task.category_name = category?.name;
    task.board_name = board?.name;
    task.board_id = board?._id;
    task.workspace_name = workspace?.name;
    task.workspace_id = workspace?._id;
  });

  return tasks;
}

export async function updateTasks(tasks: Task[]) {
  const STORE = useRootStore();
  const BOARD_STORE = useBoardStore();
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!BOARD_STORE.activeBoard || !WORKSPACE_STORE.activeWorkspace) return;

  try {
    const res = await mande(baseApi + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/tasks/').put<any>({ tasks, timezone: STORE.timezone })
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
    console.error(error);
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
        description: 'Возникла ошибка при обновлении задач. Попробуйте повторить позже.'
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

export function recoverTask(task: Task) {
  const STORE = useRootStore();

  if (!task) return;

  task.is_deleted = false;

  removeFromDeletedEntities(task);

  STORE.allEntities.categories.forEach(category => {
    if (category._id === task.category_id) {
      category.tasks.push(task);
      category.isCategoryUpdating = false;
    }
  })

  STORE.deletedEntities.categories.forEach(category => {
    if (category._id === task.category_id) {
      if (!category.tasks) category.tasks = [];
      category.tasks.push(task);
    }
  });
}

export async function transferTask(category: Category, selectedCategory: Category, workspace_id: string) {
  const STORE = useRootStore();

  try {
    const res = await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + workspace_id + '/tasks/transfer/' + selectedCategory._id)
      .put<any>({ newCategoryId: category._id })

    if (!res || !res.success) {
      STORE.createNotification({
        action_type: 'error',
        description: res.error.description
      });

      if (res.error.code === 54) {
        return await userFunctions.logout();
      }

      return null;
    }

    return res;
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
        description: 'Возникла ошибка при перемещении задач. Попробуйте повторить позже.'
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