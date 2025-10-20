import { fetchBoards } from '@services/board'
import { BackendError, HttpError } from '@utils/errors'
import { Board } from '@interfaces/Board'
import { defineStore, Pinia } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useWorkspaceDataStore } from './workspaceData'

type BoardErrorType = BackendError | HttpError | null

export const useBoardDataStore = (pinia?: Pinia) => {
  return defineStore('boardData', () => {
    const boards = ref<Array<Board>>([])
    const activeBoard = ref<Board | null>(null)

    const WORKSPACE_STORE = useWorkspaceDataStore()

    // Errors
    const loadBoardsError = ref<BoardErrorType>(null)

    // Loading
    const loadingStatus = ref<Map<string, boolean>>(new Map())
    const loadedWorkspaces = ref<Set<string>>(new Set())

    async function loadBoards(workspaceId: string, forceReload: boolean = false) {
      if (loadedWorkspaces.value.has(workspaceId) && !forceReload) return

      if (loadingStatus.value.get(workspaceId)) return

      loadingStatus.value.set(workspaceId, true)

      loadBoardsError.value = null

      try {
        const boardsPayload = await fetchBoards(workspaceId)
        boards.value = boardsPayload

        return true
      } catch (e) {
        if (e instanceof BackendError) {
          loadBoardsError.value = e
        } else if (e instanceof HttpError) {
          loadBoardsError.value = e

          if (e.status === 401) {
          }
        } else {
          loadBoardsError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        toast.error(loadBoardsError.value.message)

        return false
      }
    }

    async function selectBoard(newBoard: Board, shouldNavigate: boolean = false) {
      //mainStore.switchTabs(Tabs.Board);
      if (newBoard._id === activeBoard.value?._id) return

      if (WORKSPACE_STORE.activeWorkspace && shouldNavigate) {
        window.history.pushState(
          { triggeredBy: 'user' },
          '',
          `/workspace/${WORKSPACE_STORE.activeWorkspace._id}/${newBoard._id}`,
        )
      }

      activeBoard.value = newBoard
      localStorage.setItem('selectedBoard', JSON.stringify(newBoard))

      setTimeout(() => (document.title = 'Kanbar | ' + newBoard.name), 0)

      /*if (!newBoard.isFilled && !activeBoard.value.isFilling) {
      await TASK_STORE.getTasksAndCategories(newBoard);
    }*/
    }

    const isBoardsLoading = computed(() => (workspaceId: string): boolean => {
      return loadingStatus.value.get(workspaceId) === true
    })

    const areBoardsLoaded = computed(() => (workspaceId: string) => {
      return loadedWorkspaces.value.has(workspaceId)
    })

    function $reset() {}

    return {
      // State
      boards,
      activeBoard,
      loadBoardsError,
      isBoardsLoading,
      areBoardsLoaded,
      loadedWorkspaces,

      // Actions
      loadBoards,
      selectBoard,

      $reset,
    }
  })(pinia)
}
