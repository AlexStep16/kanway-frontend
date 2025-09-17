import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Category } from '../Interfaces/Category'
import { useRootStore } from './root'
import * as categoryFunctions from '../helpers/category';
import * as taskFunctions from '../helpers/task';
import * as userFunctions from '../helpers/user';
import { Task } from '../Interfaces/Task';
import { useBoardStore } from './board';
import { useWorkspaceStore } from './workspace';
import { useTipsStore } from './tips';
import { mande, MandeError } from 'mande';
import { NotificationStrict } from '../Interfaces/Notification';
import { ServerResponse } from '../Interfaces/ServerResponse';
import { ModificationResult } from '../Interfaces/ModificationResult';

export const useCategoryStore = defineStore('category', () => {
  const selectedCategory = ref<Category | null>(null)
  const selectedSearchCategory = ref<Category | null>(null)
  const availableCategories = ref<Category[]>([]);
  const showCategories = ref<boolean>(false);

  const categoryMenu = ref<HTMLDivElement | null>(null);
  const categorySortMenu = ref<HTMLDivElement | null>(null);
  const categoriesMenu = ref<HTMLDivElement | null>(null);

  const mainStore = useRootStore()
  const BOARD_STORE = useBoardStore()
  const WORKSPACE_STORE = useWorkspaceStore()
  const TIPS_STORE = useTipsStore()

  function $reset() {
    selectedCategory.value = null;
    selectedSearchCategory.value = null;
    availableCategories.value = [];
    showCategories.value = false;

    categoryMenu.value = null;
    categorySortMenu.value = null;
    categoriesMenu.value = null;
  }

  async function getDeletedCategories() {
    if (mainStore.deletedEntitiesLoadedState.categories) return;

    mainStore.deletedEntitiesLoadState.categories = true;

    const deletedCategories = await categoryFunctions.getter.deletedCategories();

    if (deletedCategories) {
      categoryFunctions.fillCategoriesWithBoards(deletedCategories);

      mainStore.deletedEntities.categories = deletedCategories;
    }

    mainStore.deletedEntitiesLoadState.categories = false;
    mainStore.deletedEntitiesLoadedState.categories = true;
  }

  function setSelectedCategory(category: Category) {
    selectedCategory.value = category;
  }

  function setSelectedSearchCategory(category: Category | null) {
    selectedSearchCategory.value = category;
  }

  function closeMenus() {
    if (!selectedCategory.value) return;

    selectedCategory.value.isSortMenuOpened = false
    showCategories.value = false
    selectedCategory.value.isMenuOpened = false
  }

  async function editCategory(category: Category): Promise<unknown> {
    if (!BOARD_STORE.activeBoard || !WORKSPACE_STORE.activeWorkspace) return false;

    const preparedCategory = { ...category };
    const mode = preparedCategory._id === "" ? "add" : "edit";

    if (!category.name && category.savedName) {
      category.name = category.savedName;

      return false;
    }

    if (category.name === category.savedName) return false;

    delete preparedCategory.refInputElement;
    delete preparedCategory.refDivElement;

    category.isCategoryUpdating = true;

    if (mode === "add") {
      const result = await categoryFunctions.add.addCategory(preparedCategory, WORKSPACE_STORE.activeWorkspace._id);
      category.isCategoryUpdating = false;

      if (result.success && result.data) {
        category._id = result.data._id;
        category.isNameInputShown = false;
      } else {
        mainStore.allEntities.categories.splice(mainStore.allEntities.categories.indexOf(category), 1);
      }

      return result;
    } else {
      const editResult = await categoryFunctions.edit.editCategory(preparedCategory, WORKSPACE_STORE.activeWorkspace._id);

      if (!editResult) {
        category.name = category.savedName ?? category.name;
      }

      category.isCategoryUpdating = false;

      return editResult;
    }
  }

  function updateTasksCategoryIds(tasks: Task[], newCategoryId: string): void {
    tasks.forEach(task => {
      task.category_id = newCategoryId;
    });
  }

  function addTasksToCategory(category: Category, tasks: Task[]): void {
    category.tasks.push(...tasks);
  }

  function clearTasksFromCategory(category: Category): void {
    category.tasks = [];
  }

  async function transferTasks(category: Category) {
    showCategories.value = false;

    if (!selectedCategory.value || !selectedCategory.value.tasks || !WORKSPACE_STORE.activeWorkspace) return;

    closeMenus()

    const selectedCategoryLink = selectedCategory.value;

    selectedCategoryLink.isCategoryUpdating = true;

    await taskFunctions.transfer.transferTask(category, selectedCategoryLink, WORKSPACE_STORE.activeWorkspace._id);

    updateTasksCategoryIds(selectedCategoryLink.tasks, category._id);
    addTasksToCategory(category, selectedCategoryLink.tasks);
    clearTasksFromCategory(selectedCategoryLink);

    selectedCategoryLink.isCategoryUpdating = false;
  }

  function showSortMenu() {
    if (selectedCategory.value) {
      selectedCategory.value.isSortMenuOpened = true
      selectedCategory.value.isMenuOpened = false;
    }
  }

  function backToCatMenu() {
    if (!selectedCategory.value) return;

    selectedCategory.value.isSortMenuOpened = false
    showCategories.value = false
    selectedCategory.value.isMenuOpened = true
  }

  function addWatchForCreateTaskTip(category: Category) {
    if (!category || !category.addTaskButtonRef) return;

    const addTaskWatcher = watch(category.addTaskButtonRef, () => {
      if (!category.addTaskButtonRef?.value) return;

      const createTaskTip = TIPS_STORE.getTipByType("createTask");

      if (createTaskTip) {
        createTaskTip.overlayTarget = category.refDivElement;
        createTaskTip.zIndexRefElement = category.addTaskButtonRef.value;
        createTaskTip.anchor = category.addTaskButtonRef.value;
      }

      if (TIPS_STORE.observer) TIPS_STORE.observer.observe(category.addTaskButtonRef.value);

      addTaskWatcher();
    })
  }

  async function recoverCategory(category: Category) {
    if (!WORKSPACE_STORE.activeWorkspace || !category) return;
    category.isCategoryUpdating = true;

    if (mainStore.notifications) {
      const notification = mainStore.notifications.find((noty: NotificationStrict) => noty._id === category._id);

      if (notification) mainStore.removeNotification(notification);
    };

    try {
      const res = await mande(
        import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/categories/recover/' + category._id
      ).put<ServerResponse<ModificationResult>>({
        timezone: mainStore.timezone
      });

      const recoverResult = res.result;

      if (!res || !res.success) {
        mainStore.createNotification({
          action_type: 'error',
          description: res.error.description
        });

        if (res.error.code === 54) {
          return await userFunctions.logout();
        }

        return;
      }

      if (recoverResult && recoverResult.result && recoverResult.result.modifiedCount !== 0) {
        mainStore.updateCurrentEntitiesByOpLogs(recoverResult.operation_logs);
      }

      categoryFunctions.edit.recoverCategory(category);

      category.isCategoryUpdating = false;

      mainStore.createNotification({
        action_type: 'success',
        description: `Категория ${category.name} успешно восстановлена!`
      });
    } catch (error) {
      const mandeError = error as MandeError;

      if (mandeError.response && mandeError.response.status !== 200) {
        if (mandeError.body && mandeError.body.length > 0) {
          for (const e of mandeError.body) {
            mainStore.createNotification({
              action_type: 'error',
              description: e.description
            });
          }

          return false;
        }

        mainStore.createNotification({
          action_type: 'error',
          description: 'Возникла ошибка при восстановлении категории. Попробуйте повторить позже.'
        });
      } else {
        mainStore.createNotification({
          action_type: 'error',
          description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
        });
      }

      return false;
    }

    category.isCategoryUpdating = false;
  }

  return {
    selectedCategory,
    selectedSearchCategory,
    showCategories,
    availableCategories,
    categoryMenu,
    categorySortMenu,
    categoriesMenu,
    getDeletedCategories,
    addWatchForCreateTaskTip,
    recoverCategory,
    setSelectedCategory,
    setSelectedSearchCategory,
    editCategory,
    transferTasks,
    showSortMenu,
    backToCatMenu,
    closeMenus,
    $reset
  }
})