import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Board } from '../Interfaces/Board'
import { useRootStore } from './root'
import { useWorkspaceStore } from './workspace'
import { useTaskStore } from './task'
import { useSidebarStore } from './sidebar'
import { useTipsStore } from './tips'
import * as boardFunctions from '../helpers/board';
import * as userFunctions from '../helpers/user';
import { Workspace } from '../Interfaces/Workspace'
import Tabs from '../enums/TabsEnum'
import { mande, MandeError } from 'mande'
import { NotificationStrict } from '../Interfaces/Notification'
import { ServerResponse } from '../Interfaces/ServerResponse'
import { ModificationResult } from '../Interfaces/ModificationResult'

export const useBoardStore = defineStore('board', () => {
  const activeBoard = ref<Board | null>(null);
  const isCreateBoardDisplayed = ref<boolean>(false);

  const mainStore = useRootStore();
  const WORKSPACE_STORE = useWorkspaceStore();
  const TASK_STORE = useTaskStore();
  const SIDEBAR_STORE = useSidebarStore();
  const TIPS_STORE = useTipsStore();

  function $reset() {
    activeBoard.value = null;
  }

  async function getDeletedBoards() {
    if (mainStore.deletedEntitiesLoadedState.boards) return;

    mainStore.deletedEntitiesLoadState.boards = true;
    const deletedBoards = await boardFunctions.getter.deletedBoards();
    if (deletedBoards) {
      boardFunctions.fillBoardsWithWorkspace(deletedBoards);
      const existingBoards = mainStore.deletedEntities.boards.map(board => board._id);

      for (const board of deletedBoards) {
        if (!existingBoards.includes(board._id)) mainStore.deletedEntities.boards.push(board);
      }
    }

    mainStore.deletedEntitiesLoadState.boards = false;
    mainStore.deletedEntitiesLoadedState.boards = true;
  }

  function getSpecificWorkspaceBoards(workspace_id: string) {
    return mainStore.allEntities.boards.filter(board => board.workspace_id === workspace_id);
  }

  const getWorkspaceBoards = computed(() => {
    return mainStore.allEntities.boards.filter(board => WORKSPACE_STORE.activeWorkspace && board.workspace_id === WORKSPACE_STORE.activeWorkspace._id)
  })

  const getIsBoardFilling = computed(() => {
    return activeBoard.value ? activeBoard.value.isFilling : false;
  });

  async function selectBoard(newBoard: Board, shouldNavigate: boolean = false) {
    mainStore.switchTabs(Tabs.Board);
    if (newBoard._id === activeBoard.value?._id) return;

    if (WORKSPACE_STORE.activeWorkspace && shouldNavigate) {
      window.history.pushState({ triggeredBy: 'user' }, '', `/workspace/${WORKSPACE_STORE.activeWorkspace._id}/${newBoard._id}`);
    }

    activeBoard.value = newBoard;
    localStorage.setItem('selectedBoard', JSON.stringify(newBoard));

    setTimeout(() => document.title = "Kanbar | " + newBoard.name, 0);

    if (!newBoard.isFilled && !activeBoard.value.isFilling) {
      await TASK_STORE.getTasksAndCategories(newBoard);
    }
  }

  async function getBoards(workspace_id: string): Promise<void> {
    const data = await boardFunctions.getter.boards(workspace_id);

    if (!data || data.length === 0) return;

    data.forEach((board: Board) => {
      board.isMenuOpened = false;
      board.isTransferMenuOpened = false;
      board.isFilling = false;

      if (!mainStore.allEntities.boards.find((storeBoard: Board) => storeBoard._id === board._id)) {
        mainStore.allEntities.boards.push(board);
      }
    })
  }

  function closeMenus(board: Board) {
    board.isMenuOpened = false;
    board.isTransferMenuOpened = false;
  }

  function removeBoardWithTasksFromStore(board: Board) {
    mainStore.allEntities.boards.splice(mainStore.allEntities.boards.indexOf(board), 1);
    mainStore.allEntities.categories = mainStore.allEntities.categories.filter(category => category.board_id !== board._id);
  }

  function afterBoardCreate(newBoard: Board, isNoAction?: boolean) {
    newBoard.isFilled = true;
    if (typeof newBoard.order === 'undefined') newBoard.order = mainStore.allEntities.boards.length + 1;

    mainStore.allEntities.boards.push(newBoard);

    if (!isNoAction) {
      const index = mainStore.allEntities.boards.indexOf(newBoard)

      closeBoardCreateModal();
      selectBoard(mainStore.allEntities.boards[index], true);
    }
  }

  async function transferBoard(workspace: Workspace, board?: Board | null) {
    if (!WORKSPACE_STORE.activeWorkspace || !board) return;

    const boardToTransfer = board ? board : activeBoard.value;

    if (!boardToTransfer) return;

    closeMenus(boardToTransfer);

    boardToTransfer.isUpdating = true;

    const result = await boardFunctions.transfer.transferBoard(workspace, boardToTransfer)

    boardToTransfer.isUpdating = false;

    if (!result) return;

    if (workspace.isFilled) boardToTransfer.workspace_id = workspace._id;
    else removeBoardWithTasksFromStore(boardToTransfer);

    selectBoard(getWorkspaceBoards.value[0])
  }

  async function cloneBoard(board?: Board) {
    if (isLimitReached.value) {
      showLimitNotification();

      return;
    }

    if (!WORKSPACE_STORE.activeWorkspace || (!board && !activeBoard.value)) return;

    const boardToClone = board ? board : activeBoard.value;

    if (!boardToClone) return;

    if (SIDEBAR_STORE.selectedBoard) SIDEBAR_STORE.selectedBoard.isMenuOpened = false;

    await boardFunctions.clone.cloneBoard(boardToClone)

    closeMenus(boardToClone)
  }

  function closeBoardCreateModal() {
    isCreateBoardDisplayed.value = false;
  }

  function openBoardCreateModal() {
    if (TIPS_STORE.currentTip?.type === 'createBoard') return;

    if (!WORKSPACE_STORE.activeWorkspace?.isFilled) return;

    if (isLimitReached.value) {
      showLimitNotification();
      return;
    }

    isCreateBoardDisplayed.value = true;
  }

  const isLimitReached = computed(() => {
    return mainStore.allEntities.boards.length >= 5 && !mainStore.isUserPremium();
  })

  function showLimitNotification() {
    mainStore.createNotification({
      action_type: 'error',
      description: 'Вы достигли лимита по количеству досок для бесплатного тарифа.'
    })
  }

  async function recoverBoard(board: Board) {
    if (!WORKSPACE_STORE.activeWorkspace) return;
    board.isUpdating = true;

    if (mainStore.notifications) {
      const notification = mainStore.notifications.find((noty: NotificationStrict) => noty._id === board._id);

      if (notification) mainStore.removeNotification(notification);
    };

    await mande(import.meta.env.VITE_SERVER_BASE_URL + '/workspace/' + WORKSPACE_STORE.activeWorkspace._id + '/boards/recover/' + board._id)
      .put<ServerResponse<ModificationResult>>({
        timezone: mainStore.timezone
      })
      .then(async res => {
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

        boardFunctions.editor.recoverBoard(board);

        mainStore.createNotification({
          action_type: 'success',
          description: `Доска ${board.name} успешно восстановлена!`
        });
      }).catch((error: MandeError) => {
        if (error.response && error.response.status !== 200) {
          if (error.body && error.body.length > 0) {
            for (const e of error.body) {
              mainStore.createNotification({
                action_type: 'error',
                description: e.description
              });
            }

            return false;
          }

          mainStore.createNotification({
            action_type: 'error',
            description: 'Возникла ошибка при восстановлении доски. Попробуйте повторить позже.'
          });
        } else {
          mainStore.createNotification({
            action_type: 'error',
            description: 'Возникла непредвиденная ошибка. Попробуйте повторить позже.'
          });
        }

        return false;
      }).finally(() => {
        board.isUpdating = false;
      })
  }

  async function switchBoardAfterChange(board: Board) {
    const availableBoards = mainStore.allEntities.boards.filter(b => WORKSPACE_STORE.activeWorkspace && b.workspace_id === WORKSPACE_STORE.activeWorkspace._id);

    if (
      mainStore.allEntities.boards &&
      availableBoards.length > 0 &&
      activeBoard.value?._id === board._id
    ) {
      if (mainStore.showBoard) selectBoard(availableBoards[0], true)
      localStorage.removeItem('selectedBoard');
    }
  }

  return {
    activeBoard,
    getIsBoardFilling,
    getDeletedBoards,
    isCreateBoardDisplayed,
    closeBoardCreateModal,
    openBoardCreateModal,
    isLimitReached,
    getWorkspaceBoards,
    showLimitNotification,
    recoverBoard,
    getSpecificWorkspaceBoards,
    afterBoardCreate,
    getBoards,
    selectBoard,
    transferBoard,
    cloneBoard,
    switchBoardAfterChange,
    $reset
  }
})