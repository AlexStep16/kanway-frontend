import { useWorkspaceStore } from "../stores/workspace";
import { OperationLog } from "../Interfaces/OperationLog";
import { Workspace } from "../Interfaces/Workspace";
import { useRootStore } from "../stores/root";
import { Category } from "../Interfaces/Category";
import { Board } from "../Interfaces/Board";
import { Task } from "../Interfaces/Task";
import { useBoardStore } from "../stores/board";
import { useCategoryStore } from "../stores/category";
import * as categoryFunctions from './category';
import * as taskFunctions from '../helpers/task';
import * as boardFunctions from '../helpers/board';
import * as workspaceFunctions from '../helpers/workspace';


function replaceAttributes(target: any, source: any) {
  console.log('replaceAttributes', target, source);
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
}

function updateWorkspacesEntities(data: { previous_version: Workspace | null, actual_version: Workspace | null }[]) {
  const STORE = useRootStore();

  for (const { previous_version, actual_version } of data) {
    if (!previous_version || !actual_version) continue;

    const workspace = STORE.allEntities.workspaces.find((w: any) => w._id === previous_version._id);

    if (workspace) {
      replaceAttributes(workspace, actual_version);

      if (actual_version.is_deleted === true && workspace.is_deleted === false && STORE.deletedEntitiesLoadedState.boards === true) {
        workspaceFunctions.addWorkspaceToDeletedEntities(workspace);
      }
    } else {
      const deletedWorkspace = STORE.deletedEntities.workspaces.find((w: any) => w._id === previous_version._id);

      if (deletedWorkspace) {
        replaceAttributes(deletedWorkspace, actual_version);

        workspaceFunctions.recoverWorkspace(deletedWorkspace);
      }
    }
  }
}

function updateBoardsEntities(data: { previous_version: Board | null, actual_version: Board | null }[]) {
  const STORE = useRootStore();

  const useBoardStoremove: any = [];

  for (const { previous_version, actual_version } of data) {
    if (!previous_version || !actual_version) continue;

    const board = STORE.allEntities.boards.find((b: any) => b._id === previous_version._id);

    if (board) {
      if (actual_version.workspace_id !== board.workspace_id) {
        const targetWorkspace = STORE.allEntities.workspaces.find((w: Workspace) => w._id === actual_version.workspace_id);

        if (!targetWorkspace || !targetWorkspace.isFilled) {
          useBoardStoremove.push({ ...board });
        }
      }

      replaceAttributes(board, actual_version);

      if (actual_version.is_deleted === true && board.is_deleted === false && STORE.deletedEntitiesLoadedState.boards === true) {
        boardFunctions.addBoardsToDeletedEntities(board);
      }
    } else {
      const deletedBoard = STORE.deletedEntities.boards.find((b: any) => b._id === previous_version._id);

      if (deletedBoard) {
        replaceAttributes(deletedBoard, actual_version);

        boardFunctions.recoverBoard(deletedBoard);
      }
    }
  }

  STORE.allEntities.boards = STORE.allEntities.boards.filter((board: any) => {
    return !useBoardStoremove.some((b: any) => b._id === board._id);
  });
}

function updateCategoriesEntities(data: { previous_version: Category | null, actual_version: Category | null }[]) {
  const STORE = useRootStore();

  const categoriesToRemove: any = [];

  for (const { previous_version, actual_version } of data) {
    if (!previous_version || !actual_version) continue;

    const category = STORE.allEntities.categories.find((b: Category) => b._id === previous_version._id);

    if (category) {
      if (actual_version.board_id !== category.board_id) {
        const targetBoard = STORE.allEntities.boards.find((b: Board) => b._id === actual_version.board_id);

        if (!targetBoard || !targetBoard.isFilled) {
          categoriesToRemove.push({ ...category });
        }
      }

      replaceAttributes(category, actual_version);

      if (actual_version.is_deleted === true && category.is_deleted === false && STORE.deletedEntitiesLoadedState.categories === true) {
        categoryFunctions.addCategoriesToDeletedEntities(category);
      }
    } else {
      const deletedCategory = STORE.deletedEntities.categories.find((c: any) => c._id === previous_version._id);

      if (deletedCategory) {
        replaceAttributes(deletedCategory, actual_version);

        categoryFunctions.recoverCategory(deletedCategory);
      }
    }
  }

  STORE.allEntities.categories = STORE.allEntities.categories.filter((category: any) => {
    return !categoriesToRemove.some((c: any) => c._id === category._id);
  });
}

function updateTasksEntities(data: { previous_version: Task | null, actual_version: Task | null }[]) {
  const STORE = useRootStore();

  for (const { previous_version, actual_version } of data) {
    if (!previous_version || !actual_version) continue;

    const previousCategory = STORE.allEntities.categories.find((c: any) => c._id === previous_version.category_id);
    const actualCategory = STORE.allEntities.categories.find((c: any) => c._id === actual_version.category_id);
    const tasksToMove: any = [];
    let needMove = true;
    let task: Task | null = null;
    let taskCategory: Category | null = null;

    if (!previousCategory && !actualCategory) {
      return;
    }

    if (previousCategory && previousCategory.tasks && Array.isArray(previousCategory.tasks)) {
      task = previousCategory.tasks.find((t: any) => t._id === previous_version._id) || null;

      if (task) taskCategory = previousCategory;
    }

    if (!task && actualCategory && actualCategory.tasks && Array.isArray(actualCategory.tasks)) {
      task = actualCategory.tasks.find((t: any) => t._id === previous_version._id) || null;

      if (task) {
        needMove = false;
        taskCategory = actualCategory;
      }
    }

    if (task && taskCategory) {
      if (actual_version.category_id && actual_version.category_id !== previous_version.category_id && needMove) {
        tasksToMove.push(task);
      }

      replaceAttributes(task, actual_version);

      if (actual_version.is_deleted === true && task.is_deleted === false && STORE.deletedEntitiesLoadedState.tasks === true) {
        taskFunctions.addTaskToDeletedEntities(task, taskCategory);
      }

      if (tasksToMove.length > 0) {
        tasksToMove.forEach((task: any) => {
          const targetCategory = STORE.allEntities.categories.find((c: any) => c._id === task.category_id);

          if (targetCategory) {
            if (!targetCategory.tasks) targetCategory.tasks = [];

            targetCategory.tasks.push(task);
          }
        });
      }
    } else if (!task) {
      const deletedTask = STORE.deletedEntities.tasks.find((t: any) => t._id === previous_version._id);

      if (deletedTask) {
        replaceAttributes(deletedTask, actual_version);

        taskFunctions.recoverTask(deletedTask);
      }
    }
  }
}

function createWorkspacesEntities(data: { previous_version: Workspace | null, actual_version: Workspace | null }[]) {
  const WORKSPACE_STORE = useWorkspaceStore();

  for (const { actual_version } of data) {
    if (!actual_version) continue;

    WORKSPACE_STORE.afterCreateWorkspace(actual_version, true);
  }
}

function createBoardsEntities(data: { previous_version: Board | null, actual_version: Board | null }[]) {
  const BOARD_STORE = useBoardStore();

  for (const { actual_version } of data) {
    if (!actual_version) continue;

    BOARD_STORE.afterBoardCreate(actual_version, true);
  }
}

function createCategoriesEntities(data: { previous_version: Category | null, actual_version: Category | null }[]) {
  const CATEGORY_STORE = useCategoryStore();
  const STORE = useRootStore();
  const categories: Category[] = data.map(({ actual_version }) => actual_version).filter((cat) => cat !== null);

  const currentCategoriesLength = STORE.allEntities.categories.length;

  if (categories.length > 0) {
    categoryFunctions.prepareRawCategories(categories);
  }

  if (currentCategoriesLength === 0 && STORE.allEntities.categories.length > 0) {
    CATEGORY_STORE.addWatchForCreateTaskTip(STORE.allEntities.categories[0]);
  }
}

function createTasksEntities(data: { previous_version: Task | null, actual_version: Task | null }[]) {
  const STORE = useRootStore();

  const tasks: Task[] = data.map(({ actual_version }) => actual_version).filter((task) => task !== null);

  const preparedTasks = tasks.map((task: Task) => categoryFunctions.getPreparedTask(task));

  STORE.allEntities.categories.forEach((category: any) => {
    if (!category.tasks) category.tasks = [];

    const newTasks = preparedTasks.filter((task: any) => task.category_id === category._id);

    category.tasks.push(...newTasks);
  });
}

function deleteWorkspacesEntities(data: { document_id: string }[]) {
  const STORE = useRootStore();

  for (const { document_id } of data) {
    if (!document_id) continue;

    const workspace = STORE.allEntities.workspaces.find((w: Workspace) => w._id === document_id);

    if (workspace) {
      workspaceFunctions.removeFromMainEntities(workspace);
    } else {
      const deletedWorkspace = STORE.deletedEntities.workspaces.find((w: Workspace) => w._id === document_id);

      if (deletedWorkspace && STORE.deletedEntitiesLoadedState.workspaces) {
        workspaceFunctions.removeFromDeletedEntities(deletedWorkspace);
      }
    }
  }
}

function deleteBoardsEntities(data: { document_id: string }[]) {
  const STORE = useRootStore();

  for (const { document_id } of data) {
    if (!document_id) continue;

    const board = STORE.allEntities.boards.find((b: Board) => b._id === document_id);

    if (board) {
      boardFunctions.removeFromMainEntities(board);
    } else {
      const deletedBoard = STORE.deletedEntities.boards.find((b: Board) => b._id === document_id);

      if (deletedBoard && STORE.deletedEntitiesLoadedState.boards) {
        boardFunctions.removeFromDeletedEntities(deletedBoard);
      }
    }
  }
}

function deleteCategoriesEntities(data: { document_id: string }[]) {
  const STORE = useRootStore();

  for (const { document_id } of data) {
    if (!document_id) continue;

    const category = STORE.allEntities.categories.find((c: Category) => c._id === document_id);

    if (category) {
      categoryFunctions.removeFromMainEntities(category);
    } else {
      const deletedCategory = STORE.deletedEntities.categories.find((c: Category) => c._id === document_id);

      if (deletedCategory && STORE.deletedEntitiesLoadedState.categories) {
        categoryFunctions.removeFromDeletedEntities(deletedCategory);
      }
    }
  }
}

function deleteTasksEntities(data: { document_id: string }[]) {
  const STORE = useRootStore();

  for (const { document_id } of data) {
    if (!document_id) continue;

    const category = STORE.allEntities.categories.find((c: Category) => c.tasks && c.tasks.some((t: Task) => t._id === document_id));
    const task = category?.tasks.find((t: Task) => t._id === document_id);

    if (category && task) {
      taskFunctions.removeFromMainEntities(task, category);
    } else {
      const deletedTask = STORE.deletedEntities.tasks.find((t: Task) => t._id === document_id);

      if (deletedTask && STORE.deletedEntitiesLoadedState.tasks) {
        taskFunctions.removeFromDeletedEntities(deletedTask);
      }
    }
  }
}

function updateEntities(operation_log: OperationLog) {
  if (!operation_log) return;

  switch (operation_log.collection_name) {
    case 'workspaces':
      updateWorkspacesEntities(operation_log.undo_data);
    case 'boards':
      updateBoardsEntities(operation_log.undo_data);
    case 'categories':
      updateCategoriesEntities(operation_log.undo_data);
    case 'tasks':
      updateTasksEntities(operation_log.undo_data);
  }
}

function createEntities(operation_log: OperationLog) {
  if (!operation_log) return;

  switch (operation_log.collection_name) {
    case 'workspaces':
      createWorkspacesEntities(operation_log.undo_data);
    case 'boards':
      createBoardsEntities(operation_log.undo_data);
    case 'categories':
      createCategoriesEntities(operation_log.undo_data);
    case 'tasks':
      createTasksEntities(operation_log.undo_data);
  }
}

function deleteEntities(operation_log: OperationLog) {
  if (!operation_log) return;

  switch (operation_log.collection_name) {
    case 'workspaces':
      deleteWorkspacesEntities(operation_log.undo_data);
    case 'boards':
      deleteBoardsEntities(operation_log.undo_data);
    case 'categories':
      deleteCategoriesEntities(operation_log.undo_data);
    case 'tasks':
      deleteTasksEntities(operation_log.undo_data);
  }
}

export function updateCurrentEntities(operation_logs: OperationLog[]) {
  const WORKSPACE_STORE = useWorkspaceStore();

  if (!WORKSPACE_STORE.activeWorkspace || !WORKSPACE_STORE.activeWorkspace._id) return;

  operation_logs.forEach(log => {
    if (log.operation_type === 'UPDATE') {
      updateEntities(log);
    } else if (log.operation_type === 'CREATE') {
      createEntities(log);
    } else if (log.operation_type === 'DELETE') {
      deleteEntities(log);
    }
  });
}