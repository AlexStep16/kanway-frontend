import { createBoard, fetchBoards, saveBoard } from '@services/board'
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
    const addBoardError = ref<BoardErrorType>(null)
    const editBoardsError = ref<Map<string, BoardErrorType>>(new Map())

    // Loading
    const loadingStatus = ref<Map<string, boolean>>(new Map())
    const loadedWorkspaces = ref<Set<string>>(new Set())
    const _isAddingBoard = ref<boolean>(false)
    const editingBoards = ref<Set<string>>(new Set())

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

    async function addBoardToWorkspace(
      board: Partial<Board>,
      workspace_id: string | null,
    ): Promise<Board | false> {
      if (!workspace_id || !board) return false

      try {
        _isAddingBoard.value = true

        const newBoard = await createBoard({ ...board, workspace_id }, workspace_id)

        boards.value.push(...newBoard)

        toast.success('Доска успешно создана')

        return newBoard[0]
      } catch (e) {
        if (e instanceof BackendError) {
          addBoardError.value = e
        } else if (e instanceof HttpError) {
          addBoardError.value = e

          if (e.status === 401) {
          }
        } else {
          addBoardError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        toast.error(addBoardError.value.message)

        return false
      } finally {
        _isAddingBoard.value = false
      }
    }

    async function updateBoard(board: Board, workspace_id: string | null): Promise<Board | false> {
      if (!workspace_id || !board) return false

      try {
        editingBoards.value.add(board._id)

        const editResult = await saveBoard(board, workspace_id)

        const newBoard = editResult.find((b) => b._id === board._id)

        const boardIndex = boards.value.findIndex((b) => b._id === board._id)

        if (boardIndex !== -1 && newBoard) {
          Object.assign(boards.value[boardIndex], newBoard)
        }

        toast.success('Доска успешно обновлена')

        return newBoard ?? false
      } catch (e) {
        if (e instanceof BackendError) {
          editBoardsError.value.set(board._id, e)
        } else if (e instanceof HttpError) {
          editBoardsError.value.set(board._id, e)

          if (e.status === 401) {
          }
        } else {
          editBoardsError.value.set(board._id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
        }

        toast.error(
          editBoardsError.value.get(board._id)?.message || 'Ошибка при редактировании доски',
        )

        return false
      } finally {
        editingBoards.value.delete(board._id)
      }
    }

    const isBoardsLoading = computed(() => (workspaceId: string): boolean => {
      return loadingStatus.value.get(workspaceId) === true
    })

    const areBoardsLoaded = computed(() => (workspaceId: string) => {
      return loadedWorkspaces.value.has(workspaceId)
    })

    const isAddingBoard = computed((): boolean => {
      return _isAddingBoard.value
    })

    const isBoardEditing = computed(() => (boardId: string): boolean => {
      return editingBoards.value.has(boardId)
    })

    const getActiveWorkspaceBoards = computed((): Board[] => {
      if (!WORKSPACE_STORE.activeWorkspace) return []

      return boards.value.filter(
        (board) => board.workspace_id === WORKSPACE_STORE.getActiveWorkspaceId,
      )
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
      _isAddingBoard,
      isAddingBoard,
      isBoardEditing,
      addBoardError,
      editBoardsError,
      getActiveWorkspaceBoards,

      // Actions
      loadBoards,
      selectBoard,
      addBoardToWorkspace,
      updateBoard,

      $reset,
    }
  })(pinia)
}
