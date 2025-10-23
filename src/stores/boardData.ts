import {
  archiveBoard as archiveBoardService,
  cloneBoard as cloneBoardService,
  createBoard,
  fetchBoards,
  removeBoard,
  saveBoard,
} from '@services/board'
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
    const _addBoardError = ref<BoardErrorType>(null)
    const _editBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _deleteBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _archiveBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _cloneBoardsError = ref<Map<string, BoardErrorType>>(new Map())

    // Loading
    const _loadingStatusWorkspaces = ref<Map<string, boolean>>(new Map())
    const _loadedWorkspaces = ref<Set<string>>(new Set())
    const _isAddingBoard = ref<boolean>(false)
    const _editingBoards = ref<Set<string>>(new Set())
    const _deletingBoards = ref<Set<string>>(new Set())
    const _archivingBoards = ref<Set<string>>(new Set())
    const _cloningBoards = ref<Set<string>>(new Set())
    const _movingBoards = ref<Set<string>>(new Set())
    const _addingToFavoritesBoards = ref<Set<string>>(new Set())

    async function loadBoards(workspace_id: string, force_reload: boolean = false) {
      if (_loadedWorkspaces.value.has(workspace_id) && !force_reload) return
      if (_loadingStatusWorkspaces.value.get(workspace_id)) return
      if (areBoardsLoaded(workspace_id) || areBoardsLoading(workspace_id)) return

      _loadingStatusWorkspaces.value.set(workspace_id, true)

      loadBoardsError.value = null

      try {
        const boardsPayload = await fetchBoards(workspace_id)

        boards.value = boards.value.filter((b) => b.workspace_id !== workspace_id) // Remove old boards of this workspace
        boards.value.push(...boardsPayload)
        _loadedWorkspaces.value.add(workspace_id)

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
      } finally {
        _loadingStatusWorkspaces.value.set(workspace_id, false)
      }
    }

    async function selectBoard(newBoard: Board, shouldNavigate: boolean = false) {
      if (!newBoard || newBoard._id === activeBoard.value?._id) return

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

    async function _addBoardToWorkspace(
      payload: Partial<Board>,
      workspace_id: string | null,
    ): Promise<Board | false> {
      if (!workspace_id || !payload) return false

      try {
        _isAddingBoard.value = true

        const newBoards: Board[] = await createBoard({ ...payload, workspace_id }, workspace_id)

        boards.value.push(...newBoards)

        return newBoards[0]
      } catch (e) {
        if (e instanceof BackendError) {
          _addBoardError.value = e
        } else if (e instanceof HttpError) {
          _addBoardError.value = e

          if (e.status === 401) {
          }
        } else {
          _addBoardError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        throw e
      } finally {
        _isAddingBoard.value = false
      }
    }

    async function addBoardToWorkspace(
      payload: Partial<Board>,
      workspace_id: string,
    ): Promise<Board | false> {
      try {
        const result = await _addBoardToWorkspace(payload, workspace_id)

        toast.success('Доска успешно создана')

        return result
      } catch {
        toast.error(_addBoardError.value?.message ?? 'Ошибка при создании доски')

        return false
      }
    }

    function _updateBoardInStore(payload: Partial<Board>, newBoard: Board) {
      const board = boards.value.find((b) => b._id === payload._id)

      if (board && newBoard) {
        const oldWorkspaceId = board.workspace_id

        Object.assign(board, newBoard)

        if (activeBoard.value?._id === newBoard._id && oldWorkspaceId !== newBoard.workspace_id) {
          selectBoard(getActiveWorkspaceBoards.value[0], true)
        }
      }
    }

    function isBoardChanged(payload: Partial<Board>): boolean {
      const board = boards.value.find((b) => b._id === payload._id)
      if (!board) return false

      return board.name !== payload.name
    }

    async function _updateBoard(payload: Partial<Board> & { _id: string }): Promise<Board> {
      if (!payload) throw new Error('Нет данных для обновления доски')

      try {
        _editingBoards.value.add(payload._id)

        const editResult = await saveBoard(payload)

        const newBoard = editResult.find((b) => b._id === payload._id)

        if (!newBoard) throw new Error('Сервер не вернул обновленную доску')

        _updateBoardInStore(payload, newBoard)

        return newBoard
      } catch (e) {
        if (e instanceof BackendError) {
          _editBoardsError.value.set(payload._id, e)
        } else if (e instanceof HttpError) {
          _editBoardsError.value.set(payload._id, e)

          if (e.status === 401) {
          }
        } else {
          _editBoardsError.value.set(
            payload._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _editingBoards.value.delete(payload._id)
      }
    }

    async function updateBoard(payload: Partial<Board> & { _id: string }): Promise<Board | false> {
      if (!isBoardChanged(payload)) return false

      try {
        const result = await _updateBoard(payload)

        toast.success('Доска успешно обновлена')

        return result
      } catch {
        toast.error(
          _editBoardsError.value.get(payload._id)?.message || 'Ошибка при редактировании доски',
        )

        return false
      }
    }

    async function _deleteBoard(board: Board, workspace_id: string): Promise<void> {
      if (!board) throw new Error('Нет доски для удаления')

      try {
        _deletingBoards.value.add(board._id)

        await removeBoard(board._id, workspace_id)

        const boardIndex = boards.value.findIndex((b) => b._id === board._id)
        if (boardIndex !== -1) {
          boards.value.splice(boardIndex, 1)

          if (activeBoard.value?._id === board._id) {
            selectBoard(boards.value[0], true)
          }
        }
      } catch (e) {
        if (e instanceof BackendError) {
          _deleteBoardsError.value.set(board._id, e)
        } else if (e instanceof HttpError) {
          _deleteBoardsError.value.set(board._id, e)

          if (e.status === 401) {
          }
        } else {
          _deleteBoardsError.value.set(
            board._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _deletingBoards.value.delete(board._id)
      }
    }

    async function deleteBoard(board: Board, workspace_id: string): Promise<boolean> {
      try {
        await _deleteBoard(board, workspace_id)

        toast.success('Доска успешно удалена')

        return true
      } catch {
        toast.error(_deleteBoardsError.value.get(board._id)?.message || 'Ошибка при удалении доски')

        return false
      }
    }

    async function _archiveBoard(board: Board, workspace_id: string): Promise<Board> {
      if (!board) throw new Error('Нет доски для архивирования')

      try {
        _archivingBoards.value.add(board._id)

        const archiveResult = await archiveBoardService(board._id, workspace_id)

        const newBoard = archiveResult.find((b) => b._id === board._id)

        const boardIndex = boards.value.findIndex((b) => b._id === board._id)
        if (boardIndex !== -1 && newBoard) {
          Object.assign(boards.value[boardIndex], newBoard)

          boards.value.splice(boardIndex, 1)

          if (activeBoard.value?._id === board._id) {
            selectBoard(boards.value[0], true)
          }
        }

        if (!newBoard) throw new Error('Сервер не вернул архивированную доску')

        return newBoard
      } catch (e) {
        if (e instanceof BackendError) {
          _archiveBoardsError.value.set(board._id, e)
        } else if (e instanceof HttpError) {
          _archiveBoardsError.value.set(board._id, e)

          if (e.status === 401) {
          }
        } else {
          _archiveBoardsError.value.set(
            board._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _archivingBoards.value.delete(board._id)
      }
    }

    async function archiveBoard(board: Board, workspace_id: string): Promise<Board | false> {
      try {
        const result = await _archiveBoard(board, workspace_id)

        toast.success('Доска успешно архивирована')

        return result
      } catch {
        toast.error(
          _archiveBoardsError.value.get(board._id)?.message || 'Ошибка при архивировании доски',
        )

        return false
      }
    }

    async function _cloneBoard(board: Board): Promise<Board> {
      if (!board) throw new Error('Нет доски для копирования')

      try {
        _cloningBoards.value.add(board._id)

        const newBoards: Board[] = await cloneBoardService(board._id, board.workspace_id)

        boards.value.push(...newBoards)

        return newBoards[0]
      } catch (e) {
        if (e instanceof BackendError) {
          _cloneBoardsError.value.set(board._id, e)
        } else if (e instanceof HttpError) {
          _cloneBoardsError.value.set(board._id, e)

          if (e.status === 401) {
          }
        } else {
          _cloneBoardsError.value.set(
            board._id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _cloningBoards.value.delete(board._id)
      }
    }

    async function cloneBoard(board: Board): Promise<Board | false> {
      try {
        const result = await _cloneBoard(board)

        toast.success('Доска успешно скопирована')

        return result
      } catch {
        toast.error(
          _cloneBoardsError.value.get(board._id)?.message || 'Ошибка при копировании доски',
        )

        return false
      }
    }

    async function moveBoard(board: Board, new_workspace_id: string) {
      const newBoard = { ...board, workspace_id: new_workspace_id }

      try {
        _movingBoards.value.add(board._id)

        const result = await _updateBoard(newBoard)

        toast.success('Доска успешно перемещена')

        return result
      } catch {
        toast.error(
          _editBoardsError.value.get(board._id)?.message || 'Ошибка при перемещении доски',
        )

        return false
      } finally {
        _movingBoards.value.delete(board._id)
      }
    }

    async function makeFavorite(board: Board) {
      const newBoard = { ...board, isFavorite: !board.isFavorite }

      try {
        _addingToFavoritesBoards.value.add(board._id)

        const result = await _updateBoard(newBoard)

        toast.success('Доска успешно добавлена в избранное')

        return result
      } catch {
        toast.error(
          _editBoardsError.value.get(board._id)?.message ||
            'Ошибка при добавлении доски в избранное',
        )

        return false
      } finally {
        _addingToFavoritesBoards.value.delete(board._id)
      }
    }

    function areBoardsLoading(workspaceId: string): boolean {
      return _loadingStatusWorkspaces.value.get(workspaceId) === true
    }

    function areBoardsLoaded(workspaceId: string): boolean {
      return _loadedWorkspaces.value.has(workspaceId)
    }

    const isAddingBoard = computed((): boolean => {
      return _isAddingBoard.value
    })

    const isBoardEditing = computed(() => (boardId: string): boolean => {
      return _editingBoards.value.has(boardId)
    })

    const isBoardDeleting = computed(() => (boardId: string): boolean => {
      return _deletingBoards.value.has(boardId)
    })

    const isBoardArchiving = computed(() => (boardId: string): boolean => {
      return _archivingBoards.value.has(boardId)
    })

    const isBoardCloning = computed(() => (boardId: string): boolean => {
      return _cloningBoards.value.has(boardId)
    })

    const isBoardMoving = computed(() => (boardId: string): boolean => {
      return _movingBoards.value.has(boardId)
    })

    const isBoardAddingToFavorites = computed(() => (boardId: string): boolean => {
      return _addingToFavoritesBoards.value.has(boardId)
    })

    const isBoardProcessing = computed(() => (boardId: string): boolean => {
      return (
        _deletingBoards.value.has(boardId) ||
        _archivingBoards.value.has(boardId) ||
        _cloningBoards.value.has(boardId) ||
        _editingBoards.value.has(boardId)
      )
    })

    const getActiveWorkspaceBoards = computed((): Board[] => {
      if (!WORKSPACE_STORE.activeWorkspace) return []

      return boards.value.filter(
        (board) => board.workspace_id === WORKSPACE_STORE.getActiveWorkspaceId,
      )
    })

    const getActiveWorkspaceFavoriteBoards = computed((): Board[] => {
      if (!WORKSPACE_STORE.activeWorkspace) return []

      return getActiveWorkspaceBoards.value.filter((board) => board.isFavorite)
    })

    function $reset() {}

    return {
      // State
      boards,
      activeBoard,
      loadBoardsError,
      areBoardsLoading,
      areBoardsLoaded,
      isAddingBoard,
      isBoardEditing,
      getActiveWorkspaceBoards,
      isBoardDeleting,
      isBoardArchiving,
      isBoardCloning,
      isBoardProcessing,
      isBoardMoving,
      isBoardAddingToFavorites,
      getActiveWorkspaceFavoriteBoards,

      // Actions
      loadBoards,
      selectBoard,
      addBoardToWorkspace,
      updateBoard,
      deleteBoard,
      archiveBoard,
      cloneBoard,
      moveBoard,
      makeFavorite,

      $reset,
    }
  })(pinia)
}
