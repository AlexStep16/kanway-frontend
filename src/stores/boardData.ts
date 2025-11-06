import {
  archiveBoard as archiveBoardService,
  cloneBoard as cloneBoardService,
  createBoard,
  fetchBoards,
  removeBoard,
  saveBoard,
} from '@services/board'
import { BackendError, HttpError } from '@utils/errors'
import BoardModel from '@/models/BoardModel'
import { defineStore, Pinia } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useTaskDataStore } from '@stores/taskData'
import { Nullable } from '@/types/utils'

type BoardErrorType = Nullable<BackendError | HttpError>

export const useBoardDataStore = (pinia?: Pinia) => {
  return defineStore('boardData', () => {
    const boards = ref<Array<BoardModel>>([])
    const activeBoard = ref<Nullable<BoardModel>>(null)

    const WORKSPACE_STORE = useWorkspaceDataStore()
    const CATEGORY_STORE = useCategoryDataStore()
    const TASK_STORE = useTaskDataStore()

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

    async function loadBoards(workspaceId: string, force_reload: boolean = false) {
      if (_loadedWorkspaces.value.has(workspaceId) && !force_reload) return
      if (_loadingStatusWorkspaces.value.get(workspaceId)) return
      if (areBoardsLoaded(workspaceId) || areBoardsLoading(workspaceId)) return

      _loadingStatusWorkspaces.value.set(workspaceId, true)

      loadBoardsError.value = null

      try {
        const boardsPayload = await fetchBoards(workspaceId)

        boards.value = boards.value.filter((b) => b.workspaceId !== workspaceId) // Remove old boards of this workspace

        boards.value.push(...boardsPayload)

        _loadedWorkspaces.value.add(workspaceId)

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
        _loadingStatusWorkspaces.value.set(workspaceId, false)
      }
    }

    async function selectBoard(newBoard: BoardModel, shouldNavigate: boolean = false) {
      if (!newBoard || newBoard.id === activeBoard.value?.id) return

      if (WORKSPACE_STORE.activeWorkspace && shouldNavigate) {
        window.history.pushState(
          { triggeredBy: 'user' },
          '',
          `/workspace/${WORKSPACE_STORE.activeWorkspace.id}/${newBoard.id}`,
        )
      }

      activeBoard.value = newBoard
      localStorage.setItem('selectedBoard', JSON.stringify(newBoard))

      setTimeout(() => (document.title = 'Kanbar | ' + newBoard.name), 0)

      if (
        !CATEGORY_STORE.areCategoriesLoaded(newBoard.id) &&
        !CATEGORY_STORE.areCategoriesLoading(newBoard.id)
      ) {
        await CATEGORY_STORE.loadCategories(newBoard.id, newBoard.workspaceId)
        await TASK_STORE.loadTasks(newBoard.id, newBoard.workspaceId)
      }
    }

    async function _addBoardToWorkspace(
      payload: Partial<BoardModel>,
      workspaceId: Nullable<string>,
    ): Promise<BoardModel | false> {
      if (!workspaceId || !payload) return false
      if (_isAddingBoard.value) throw new Error('Доска уже добавляется')

      _addBoardError.value = null

      try {
        _isAddingBoard.value = true

        const newBoards: BoardModel[] = await createBoard({ ...payload, workspaceId }, workspaceId)

        for (const newBoard of newBoards) {
          const existingBoard = boards.value.find((b) => b.id === newBoard.id)

          if (!existingBoard) {
            boards.value.push(newBoard)
          } else {
            Object.assign(existingBoard, newBoard)
          }
        }

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
      payload: Partial<BoardModel>,
      workspaceId: string,
    ): Promise<BoardModel | false> {
      try {
        const result = await _addBoardToWorkspace(payload, workspaceId)

        toast.success('Доска успешно создана')

        return result
      } catch {
        toast.error(_addBoardError.value?.message ?? 'Ошибка при создании доски')

        return false
      }
    }

    function _updateBoardsInStore(newBoards: BoardModel[]) {
      for (const newBoard of newBoards) {
        const board = boards.value.find((b) => b.id === newBoard.id)

        if (board) {
          const oldWorkspaceId = board.workspaceId

          Object.assign(board, newBoard)

          if (activeBoard.value?.id === newBoard.id && oldWorkspaceId !== newBoard.workspaceId) {
            selectBoard(getActiveWorkspaceBoards.value[0], true)
          }
        } else {
          boards.value.push(newBoard)
        }
      }
    }

    async function _updateBoard(
      payload: Partial<BoardModel> & { id: string; workspaceId: string },
    ): Promise<BoardModel> {
      if (!payload) throw new Error('Нет данных для обновления доски')
      if (isBoardProcessing(payload.id)) throw new Error('Доска уже обрабатывается')

      _editBoardsError.value.delete(payload.id)

      try {
        _editingBoards.value.add(payload.id)

        const editResult = await saveBoard(payload)

        const newBoard = editResult.find((b) => b.id === payload.id)

        if (!newBoard) throw new Error('Сервер не вернул обновленную доску')

        _updateBoardsInStore(editResult)

        return newBoard
      } catch (e) {
        if (e instanceof BackendError) {
          _editBoardsError.value.set(payload.id, e)
        } else if (e instanceof HttpError) {
          _editBoardsError.value.set(payload.id, e)

          if (e.status === 401) {
          }
        } else {
          _editBoardsError.value.set(
            payload.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _editingBoards.value.delete(payload.id)
      }
    }

    async function updateBoard(
      payload: Partial<BoardModel> & { id: string; workspaceId: string },
    ): Promise<BoardModel | false> {
      if (!isBoardChanged(payload)) return false

      try {
        const result = await _updateBoard(payload)

        return result
      } catch {
        toast.error(
          _editBoardsError.value.get(payload.id)?.message || 'Ошибка при редактировании доски',
        )

        return false
      }
    }

    async function _deleteBoard(board: BoardModel, workspaceId: string): Promise<void> {
      if (!board) throw new Error('Нет доски для удаления')
      if (isBoardProcessing(board.id)) throw new Error('Доска уже обрабатывается')

      _deleteBoardsError.value.delete(board.id)

      try {
        _deletingBoards.value.add(board.id)

        await removeBoard(board.id, workspaceId)

        const boardIndex = boards.value.findIndex((b) => b.id === board.id)
        if (boardIndex !== -1) {
          boards.value.splice(boardIndex, 1)

          if (activeBoard.value?.id === board.id) {
            selectBoard(boards.value[0], true)
          }
        }
      } catch (e) {
        if (e instanceof BackendError) {
          _deleteBoardsError.value.set(board.id, e)
        } else if (e instanceof HttpError) {
          _deleteBoardsError.value.set(board.id, e)

          if (e.status === 401) {
          }
        } else {
          _deleteBoardsError.value.set(
            board.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _deletingBoards.value.delete(board.id)
      }
    }

    async function deleteBoard(board: BoardModel, workspaceId: string): Promise<boolean> {
      try {
        await _deleteBoard(board, workspaceId)

        toast.success('Доска успешно удалена')

        return true
      } catch {
        toast.error(_deleteBoardsError.value.get(board.id)?.message || 'Ошибка при удалении доски')

        return false
      }
    }

    async function _archiveBoard(board: BoardModel, workspaceId: string): Promise<BoardModel> {
      if (!board) throw new Error('Нет доски для архивирования')
      if (isBoardProcessing(board.id)) throw new Error('Доска уже обрабатывается')

      _archiveBoardsError.value.delete(board.id)

      try {
        _archivingBoards.value.add(board.id)

        const archiveResult = await archiveBoardService(board.id, workspaceId)

        const newBoard = archiveResult.find((b) => b.id === board.id)

        const boardIndex = boards.value.findIndex((b) => b.id === board.id)
        if (boardIndex !== -1 && newBoard) {
          Object.assign(boards.value[boardIndex], newBoard)

          boards.value.splice(boardIndex, 1)

          if (activeBoard.value?.id === board.id) {
            selectBoard(boards.value[0], true)
          }
        }

        if (!newBoard) throw new Error('Сервер не вернул архивированную доску')

        return newBoard
      } catch (e) {
        if (e instanceof BackendError) {
          _archiveBoardsError.value.set(board.id, e)
        } else if (e instanceof HttpError) {
          _archiveBoardsError.value.set(board.id, e)

          if (e.status === 401) {
          }
        } else {
          _archiveBoardsError.value.set(
            board.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _archivingBoards.value.delete(board.id)
      }
    }

    async function archiveBoard(
      board: BoardModel,
      workspaceId: string,
    ): Promise<BoardModel | false> {
      try {
        const result = await _archiveBoard(board, workspaceId)

        toast.success('Доска успешно архивирована')

        return result
      } catch {
        toast.error(
          _archiveBoardsError.value.get(board.id)?.message || 'Ошибка при архивировании доски',
        )

        return false
      }
    }

    async function _cloneBoard(board: BoardModel): Promise<BoardModel> {
      if (!board) throw new Error('Нет доски для копирования')
      if (isBoardProcessing(board.id)) throw new Error('Доска уже обрабатывается')

      _cloneBoardsError.value.delete(board.id)

      try {
        _cloningBoards.value.add(board.id)

        const newBoards = await cloneBoardService(board.id, board.workspaceId)

        if (!newBoards[0]) throw new Error('Сервер не вернул новую доску')

        _updateBoardsInStore(newBoards)

        return newBoards[0]
      } catch (e) {
        if (e instanceof BackendError) {
          _cloneBoardsError.value.set(board.id, e)
        } else if (e instanceof HttpError) {
          _cloneBoardsError.value.set(board.id, e)

          if (e.status === 401) {
          }
        } else {
          _cloneBoardsError.value.set(board.id, new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null))
        }

        throw e
      } finally {
        _cloningBoards.value.delete(board.id)
      }
    }

    async function cloneBoard(board: BoardModel): Promise<BoardModel | false> {
      try {
        const result = await _cloneBoard(board)

        toast.success('Доска успешно скопирована')

        return result
      } catch {
        toast.error(
          _cloneBoardsError.value.get(board.id)?.message || 'Ошибка при копировании доски',
        )

        return false
      }
    }

    async function moveBoard(board: BoardModel, newWorkspaceId: string) {
      const newBoard: BoardModel = { ...board, workspaceId: newWorkspaceId }

      try {
        _movingBoards.value.add(board.id)

        const result = await _updateBoard(newBoard)

        toast.success('Доска успешно перемещена')

        return result
      } catch {
        toast.error(_editBoardsError.value.get(board.id)?.message || 'Ошибка при перемещении доски')

        return false
      } finally {
        _movingBoards.value.delete(board.id)
      }
    }

    async function makeFavorite(board: BoardModel) {
      const newBoard = { ...board, isFavorite: !board.isFavorite }

      try {
        _addingToFavoritesBoards.value.add(board.id)

        const result = await _updateBoard(newBoard)

        toast.success('Доска успешно добавлена в избранное')

        return result
      } catch {
        toast.error(
          _editBoardsError.value.get(board.id)?.message ||
            'Ошибка при добавлении доски в избранное',
        )

        return false
      } finally {
        _addingToFavoritesBoards.value.delete(board.id)
      }
    }

    function areBoardsLoading(workspaceId: string): boolean {
      return _loadingStatusWorkspaces.value.get(workspaceId) === true
    }

    function areBoardsLoaded(workspaceId: string): boolean {
      return _loadedWorkspaces.value.has(workspaceId)
    }

    function isBoardChanged(payload: Partial<BoardModel>): boolean {
      const board = boards.value.find((b) => b.id === payload.id)
      if (!board) return false

      if (payload.name !== undefined && board.name !== payload.name) return true
      if (payload.workspaceId !== undefined && board.workspaceId !== payload.workspaceId)
        return true

      return false
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

    function isBoardProcessing(boardId: string): boolean {
      return (
        _deletingBoards.value.has(boardId) ||
        _archivingBoards.value.has(boardId) ||
        _cloningBoards.value.has(boardId) ||
        _editingBoards.value.has(boardId)
      )
    }

    const getActiveWorkspaceBoards = computed((): BoardModel[] => {
      if (!WORKSPACE_STORE.activeWorkspace) return []

      return boards.value
        .filter((board) => board.workspaceId === WORKSPACE_STORE.getActiveWorkspaceId)
        .sort((a, b) => {
          return a.order - b.order
        })
    })

    const getActiveBoardId = computed(() => {
      return activeBoard.value?.id ?? ''
    })

    const getActiveWorkspaceFavoriteBoards = computed((): BoardModel[] => {
      if (!WORKSPACE_STORE.activeWorkspace) return []

      return getActiveWorkspaceBoards.value.filter((board) => board.isFavorite)
    })

    function getBoardById(boardId: string): Nullable<BoardModel> {
      const board = boards.value.find((b) => b.id === boardId)

      return board || null
    }

    function getOtherBoards(boardId: string): BoardModel[] {
      return boards.value
        .filter((board) => board.id !== boardId)
        .sort((a, b) => {
          return a.order - b.order
        })
    }

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
      getActiveBoardId,
      getOtherBoards,

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
      getBoardById,

      $reset,
    }
  })(pinia)
}
