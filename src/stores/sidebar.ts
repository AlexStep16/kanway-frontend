import { defineStore } from 'pinia'
import { computed, ref, ShallowReactive } from 'vue'
import { useRootStore } from './root';
import { useSettingStore } from './setting';
import { useWorkspaceStore } from './workspace';
import Tabs from '../enums/TabsEnum';
import * as settingFunctions from '../helpers/setting';
import * as boardFunctions from '../helpers/board';
import { useTaskStore } from './task';
import { useBoardStore } from './board';
import { useCategoryStore } from './category';
import { Board } from '../Interfaces/Board';
import { Workspace } from '../Interfaces/Workspace';
import { PageContext } from 'vike/types';

export const useSidebarStore = defineStore('sidebar', () => {
  const showWorkspaces = ref<boolean>(false);
  const showFavorites = ref<boolean>(false);
  const showUserAccount = ref<boolean>(false);
  const showDeleteConfirmation = ref<boolean>(false);
  const workspacesSidebarTimer = ref<any>(null);
  const selectedBoard = ref<Board | null>(null);

  const secondarySidebarRef = ref<HTMLDivElement | null>(null);
  const mainSidebarRef = ref<HTMLDivElement | null>(null);
  const boardTransferMenuRef = ref<HTMLDivElement | null>(null);
  const boardMenuRef = ref<HTMLDivElement | null>(null);
  const workspaceMenuRef = ref<HTMLDivElement | null>(null);

  const STORE = useRootStore();
  const SETTING_STORE = useSettingStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const BOARD_STORE = useBoardStore();
  const TASK_STORE = useTaskStore();
  const CATEGORY_STORE = useCategoryStore();

  function $reset() {
    showWorkspaces.value = false;
    showFavorites.value = false;
    showUserAccount.value = false;
    showDeleteConfirmation.value = false;
    workspacesSidebarTimer.value = null;
    secondarySidebarRef.value = null;
    selectedBoard.value = null;
    mainSidebarRef.value = null;
    boardTransferMenuRef.value = null;
    boardMenuRef.value = null;
    workspaceMenuRef.value = null;
  }

  async function deleteBoard(board: Board | null) {
    if (!board) return;

    closeBoardMenus(board);

    await boardFunctions.deleteBoard(board)
  }

  function switchToFavorites() {
    showFavorites.value = true;
    showWorkspaces.value = false;

    clearTimeout(workspacesSidebarTimer.value);

    setTimeout(() => {
      if (secondarySidebarRef.value) secondarySidebarRef.value.classList.add('sidebar-wrapper_switch')
      if (mainSidebarRef.value) mainSidebarRef.value.classList.add('sidebar-wrapper_switch')
    }, 0)
  }

  function switchToWorkspaces() {
    showWorkspaces.value = true;

    clearTimeout(workspacesSidebarTimer.value);

    setTimeout(() => {
      if (secondarySidebarRef.value) secondarySidebarRef.value.classList.add('sidebar-wrapper_switch')
      if (mainSidebarRef.value) mainSidebarRef.value.classList.add('sidebar-wrapper_switch')
    }, 0)
  }

  async function selectSettings() {
    if (!SETTING_STORE.settings || !WORKSPACE_STORE.activeWorkspace) return;

    STORE.showSettingsAccount = true;
    STORE.showSidebar = false;

    if (SETTING_STORE.isSettingsLoaded) return;

    SETTING_STORE.startLoading();

    const data = await settingFunctions.getter.getSettings();

    SETTING_STORE.endLoading();

    if (!data) {
      SETTING_STORE.isSettingsLoaded = false;

      return;
    }

    Object.assign(SETTING_STORE.settings, data);
  }

  function selectArchive() {
    STORE.switchTabs(Tabs.Archive);

    WORKSPACE_STORE.getDeletedWorkspaces();
    BOARD_STORE.getDeletedBoards();
    CATEGORY_STORE.getDeletedCategories();
    TASK_STORE.getDeletedTasks();
  }

  function selectBoard(event: MouseEvent, board: Board, pageContext?: ShallowReactive<PageContext>) {
    if (!event.target || !(event.target instanceof Element)) return;

    const isTargetButton = event.target.closest('.sidebar-board__options-button');

    if (!isTargetButton) {
      BOARD_STORE.selectBoard(board, true);
    }
  }

  async function selectWorkspace(event: MouseEvent, workspace: Workspace) {
    if (!event.target || !(event.target instanceof Element)) return;

    const isTargetButton = event.target.closest('.sidebar-board__options-button');

    if (!isTargetButton) {
      switchBackToMain();

      await WORKSPACE_STORE.selectWorkspace(workspace, true);
    }
  }

  function switchBackToMain() {
    if (secondarySidebarRef.value) secondarySidebarRef.value.classList.remove('sidebar-wrapper_switch')
    if (mainSidebarRef.value) mainSidebarRef.value.classList.remove('sidebar-wrapper_switch')

    workspacesSidebarTimer.value = setTimeout(() => {
      showWorkspaces.value = false
      showFavorites.value = false
    }, 300)
  }

  const getWorkspaceBoards = computed(() => {
    return STORE.allEntities.boards
      .filter(board => WORKSPACE_STORE.activeWorkspace && board.workspace_id === WORKSPACE_STORE.activeWorkspace._id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  })

  const getWorkspaceChats = computed(() => {
    return STORE.allEntities.chats;
  })

  const getFavoriteBoards = computed(() => {
    return getWorkspaceBoards.value.filter((board: any) => board.is_favorite);
  })

  const getFavoriteWorkspaces = computed(() => {
    return STORE.allEntities.workspaces.filter(workspace => workspace.is_favorite);
  })

  function closeBoardMenus(board: Board) {
    board.isMenuOpened = false;
    board.isTransferMenuOpened = false;
  }

  function switchToTransferMenu() {
    if (!selectedBoard.value) return;

    selectedBoard.value.isTransferMenuOpened = true;
    selectedBoard.value.isMenuOpened = false
  }

  function switchBackToMenu() {
    if (!selectedBoard.value) return;

    selectedBoard.value.isTransferMenuOpened = false;
    selectedBoard.value.isMenuOpened = true;
  }

  async function setBoardFavorite(board: Board | null) {
    if (!board) return;

    board.isMenuOpened = false;
    board.isUpdating = true;

    await boardFunctions.editor.editBoardApi({ ...board, is_favorite: !board.is_favorite });

    board.isUpdating = false;
  }

  return {
    showWorkspaces,
    showFavorites,
    showUserAccount,
    showDeleteConfirmation,
    workspacesSidebarTimer,
    selectedBoard,
    boardMenuRef,
    boardTransferMenuRef,
    mainSidebarRef,
    secondarySidebarRef,
    workspaceMenuRef,
    switchToFavorites,
    switchToWorkspaces,
    selectSettings,
    selectArchive,
    selectBoard,
    closeBoardMenus,
    deleteBoard,
    switchBackToMain,
    switchToTransferMenu,
    switchBackToMenu,
    selectWorkspace,
    setBoardFavorite,
    $reset,
    getWorkspaceBoards,
    getFavoriteBoards,
    getWorkspaceChats,
    getFavoriteWorkspaces
  }
})