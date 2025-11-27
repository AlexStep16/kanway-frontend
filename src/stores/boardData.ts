import {
  archiveBoard as archiveBoardService,
  recoverBoard as recoverBoardService,
  cloneBoard as cloneBoardService,
  createBoard,
  fetchArchivedBoards,
  fetchBoards,
  removeBoard,
  saveBoard,
  transformBoard,
  fetchBoardsCount,
} from '@services/board'
import { BackendError, HttpError } from '@utils/errors'
import BoardModel from '@/models/BoardModel'
import { defineStore, Pinia } from 'pinia'
import { computed, ref, watch } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useCategoryDataStore } from '@stores/categoryData'
import { useTaskDataStore } from '@stores/taskData'
import { useUIStore } from '@stores/ui'
import { Nullable } from '@/types/utils'
import { IBoard } from '@/interfaces/domain/IBoard'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import _ from 'lodash'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { IResponseWithLog } from '@/interfaces/IResponseWithLog'
import { useLogStore } from './log'

type BoardErrorType = Nullable<BackendError | HttpError>

export const useBoardDataStore = (pinia?: Pinia) => {
  return defineStore('boardData', () => {
    const boards = ref<Array<BoardModel>>([])
    const boardToEdit = ref<Nullable<BoardModel>>(null)
    const boardsCount = ref<number>(0)
    const activeBoard = ref<Nullable<BoardModel>>(null)
    watch(
      activeBoard,
      (newBoard) => {
        if (newBoard && newBoard.isDeleted && boards.value.length > 0)
          selectBoard(boards.value[0], true)
      },
      { deep: true },
    )

    const WORKSPACE_STORE = useWorkspaceDataStore()
    const CATEGORY_STORE = useCategoryDataStore()
    const TASK_STORE = useTaskDataStore()
    const UI_STORE = useUIStore()
    const LOG_STORE = useLogStore()

    const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace as IWorkspace)

    // Errors
    const loadBoardsError = ref<BoardErrorType>(null)
    const loadBoardsCountError = ref<BoardErrorType>(null)
    const loadArchivedBoardsError = ref<BoardErrorType>(null)
    const _addBoardError = ref<BoardErrorType>(null)
    const _editBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _deleteBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _archiveBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _recoverBoardsError = ref<Map<string, BoardErrorType>>(new Map())
    const _cloneBoardsError = ref<Map<string, BoardErrorType>>(new Map())

    // Loading
    const _loadingStatusWorkspaces = ref<Map<string, boolean>>(new Map())
    const _loadingStatusArchived = ref<boolean>(false)
    const _isLoadingBoardsCount = ref<boolean>(false)
    const _isArchivedBoardsLoaded = ref<boolean>(false)
    const _loadedWorkspaces = ref<Set<string>>(new Set())
    const _isAddingBoard = ref<boolean>(false)
    const _editingBoards = ref<Set<string>>(new Set())
    const _deletingBoards = ref<Set<string>>(new Set())
    const _archivingBoards = ref<Set<string>>(new Set())
    const _recoveringBoards = ref<Set<string>>(new Set())
    const _cloningBoards = ref<Set<string>>(new Set())
    const _movingBoards = ref<Set<string>>(new Set())
    const _addingToFavoritesBoards = ref<Set<string>>(new Set())

    async function loadBoards(workspaceId: string, force_reload: boolean = false) {
      if (areBoardsLoaded(workspaceId) && !force_reload) return
      if (areBoardsLoading(workspaceId)) return
      if (_loadingStatusWorkspaces.value.get(workspaceId)) return

      _loadingStatusWorkspaces.value.set(workspaceId, true)

      loadBoardsError.value = null

      try {
        const boardsPayload = await fetchBoards(workspaceId)

        boards.value = boards.value.filter((b) => b.workspaceId !== workspaceId || b.isDeleted) // Remove old boards of this workspace

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

    async function loadBoardsCount() {
      if (!WORKSPACE_STORE.getActiveWorkspace) return false

      try {
        _isLoadingBoardsCount.value = true

        const count = await fetchBoardsCount(WORKSPACE_STORE.getActiveWorkspace.id)

        boardsCount.value = count

        return count
      } catch (e) {
        if (e instanceof BackendError) {
          loadBoardsCountError.value = e
        } else if (e instanceof HttpError) {
          loadBoardsCountError.value = e

          if (e.status === 401) {
          }
        } else {
          loadBoardsCountError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        toast.error(loadBoardsCountError.value.message)

        return false
      } finally {
        _isLoadingBoardsCount.value = false
      }
    }

    async function loadArchivedBoards(force_reload: boolean = false) {
      if (_isArchivedBoardsLoaded.value && !force_reload) return
      if (_loadingStatusArchived.value) return

      loadArchivedBoardsError.value = null
      _loadingStatusArchived.value = true

      try {
        const boardsPayload = await fetchArchivedBoards()

        boards.value = boards.value.filter((b) => !b.isDeleted) // Remove old archived boards

        boards.value.push(...boardsPayload)

        _isArchivedBoardsLoaded.value = true

        return true
      } catch (e) {
        if (e instanceof BackendError) {
          loadArchivedBoardsError.value = e
        } else if (e instanceof HttpError) {
          loadArchivedBoardsError.value = e

          if (e.status === 401) {
          }
        } else {
          loadArchivedBoardsError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        toast.error(loadArchivedBoardsError.value.message)

        return false
      } finally {
        _loadingStatusArchived.value = false
      }
    }

    async function selectBoard(newBoard: BoardModel, shouldNavigate: boolean = false) {
      if (!newBoard || newBoard.id === activeBoard.value?.id) return

      if (activeWorkspace.value && shouldNavigate) {
        window.history.pushState(
          { triggeredBy: 'user' },
          '',
          `/workspace/${activeWorkspace.value.id}/${newBoard.id}`,
        )
      }

      activeBoard.value = newBoard
      localStorage.setItem('selectedBoard', JSON.stringify(newBoard))

      setTimeout(() => (document.title = 'Kanbar | ' + newBoard.name), 0)

      UI_STORE.selectBoard() // Change current UI view to board view

      await CATEGORY_STORE.loadCategories(newBoard.id, newBoard.workspaceId)
      await TASK_STORE.loadTasks(newBoard.id, newBoard.workspaceId)
    }

    function resetBoardSelection() {
      activeBoard.value = null
      localStorage.removeItem('selectedBoard')
    }

    async function _addBoardToWorkspace(
      payload: Partial<BoardModel>,
      workspaceId: Nullable<string>,
    ): Promise<IResponseWithLog<BoardModel>> {
      if (!workspaceId || !payload) throw new Error('Нет данных для создания доски')
      if (_isAddingBoard.value) throw new Error('Доска уже добавляется')

      const workspace = WORKSPACE_STORE.getWorkspaceById(workspaceId)

      if (!workspace) throw new Error('Рабочее пространство не найдено для создания доски')

      _addBoardError.value = null

      try {
        _isAddingBoard.value = true

        const createResult = await createBoard(
          { ...payload, workspaceId, workspaceName: workspace.name },
          workspaceId,
        )

        const newBoards: BoardModel[] = createResult.data

        return {
          data: newBoards[0],
          logId: createResult.logId,
        }
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
        const newBoard = result.data

        _updateBoardsInStore([newBoard])
        selectBoard(newBoard, true)

        toast.success('Доска успешно создана', {
          action: {
            label: 'Отменить',
            onClick: () => {
              if (result.logId) LOG_STORE.undo(result.logId)
            },
          },
        })

        return newBoard
      } catch {
        toast.error(_addBoardError.value?.message ?? 'Ошибка при создании доски')

        return false
      }
    }

    function _updateBoardsInStore(newBoards: ISingleUpdate<BoardModel>[]) {
      for (const newBoard of newBoards) {
        const board = boards.value.find((b) => b.id === newBoard.id)

        if (board) {
          const oldWorkspaceId = board.workspaceId

          Object.assign(board, newBoard)

          if (activeBoard.value?.id === newBoard.id && oldWorkspaceId !== newBoard.workspaceId) {
            selectBoard(getActiveWorkspaceBoards.value[0], true)
          }
        } else {
          boards.value.push(newBoard as BoardModel)
        }
      }
    }

    async function _updateBoard(
      payload: ISingleUpdate<BoardModel>,
      workspaceId: string,
    ): Promise<IResponseWithLog<BoardModel>> {
      if (!payload) throw new Error('Нет данных для обновления доски')

      _editBoardsError.value.delete(payload.id)

      try {
        _editingBoards.value.add(payload.id)

        const coreAction = () => saveBoard(payload, workspaceId)

        const editResult = await requestQueueService.enqueue(payload.id, coreAction)

        const newBoard = editResult.data.find((b) => b.id === payload.id)

        if (!newBoard) throw new Error('Сервер не вернул обновленную доску')

        return {
          data: newBoard,
          logId: editResult.logId,
        }
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
      payload: ISingleUpdate<BoardModel>,
      workspaceId: string,
      isOptimisticUpdate: boolean = false,
    ): Promise<BoardModel | false> {
      if (!payload || !isBoardChanged(payload)) return false
      const savedBoard = _.cloneDeep(boards.value.find((c) => c.id === payload.id))

      try {
        if (isOptimisticUpdate && savedBoard) {
          _updateBoardsInStore([payload])
        }

        const result = await _updateBoard(payload, workspaceId)
        const updatedBoard = result.data

        _updateBoardsInStore([updatedBoard])

        return updatedBoard
      } catch {
        if (isOptimisticUpdate && savedBoard) {
          _updateBoardsInStore([savedBoard])
        }

        toast.error(
          _editBoardsError.value.get(payload.id)?.message || 'Ошибка при редактировании доски',
        )

        return false
      }
    }

    async function _deleteBoard(board: BoardModel): Promise<void> {
      if (!board) throw new Error('Нет доски для удаления')
      if (_deletingBoards.value.has(board.id)) throw new Error('Доска уже в процессе удаления')

      _deleteBoardsError.value.delete(board.id)

      try {
        _deletingBoards.value.add(board.id)

        const coreAction = () => removeBoard(board.id, board.workspaceId)

        await requestQueueService.enqueue(board.id, coreAction)

        const boardIndex = boards.value.findIndex((b) => b.id === board.id)
        if (boardIndex !== -1) {
          boards.value.splice(boardIndex, 1)
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

    async function deleteBoard(board: BoardModel): Promise<boolean> {
      if (!board || _deletingBoards.value.has(board.id)) return false

      try {
        await _deleteBoard(board)

        toast.success('Доска успешно удалена')

        return true
      } catch {
        toast.error(_deleteBoardsError.value.get(board.id)?.message || 'Ошибка при удалении доски')

        return false
      }
    }

    async function _archiveBoard(
      board: BoardModel,
      workspaceId: string,
    ): Promise<IResponseWithLog<BoardModel[]>> {
      if (!board) throw new Error('Нет доски для архивирования')
      if (_archivingBoards.value.has(board.id))
        throw new Error('Доска уже в процессе архивирования')

      _archiveBoardsError.value.delete(board.id)

      try {
        _archivingBoards.value.add(board.id)

        const coreAction = () => archiveBoardService(board.id, workspaceId)

        const archiveResult = await requestQueueService.enqueue(board.id, coreAction)
        const archivedBoards = archiveResult.data
        const archivedBoard = archivedBoards.find((b) => b.id === board.id)

        if (!archivedBoard) throw new Error('Сервер не вернул архивированную доску')

        return {
          data: archivedBoards,
          logId: archiveResult.logId,
        }
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
      if (!board || _archivingBoards.value.has(board.id)) return false

      try {
        const archiveResult = await _archiveBoard(board, workspaceId)
        const archivedBoards = archiveResult.data
        const archivedBoard = archivedBoards.find((b) => b.id === board.id) as BoardModel

        if (!archivedBoard) throw new Error('Сервер не вернул архивированную доску')

        _updateBoardsInStore(archivedBoards)

        toast.success('Доска успешно архивирована', {
          action: {
            label: 'Отменить',
            onClick: () => {
              if (archiveResult.logId) LOG_STORE.undo(archiveResult.logId)
            },
          },
        })

        return archivedBoard
      } catch {
        toast.error(
          _archiveBoardsError.value.get(board.id)?.message || 'Ошибка при архивировании доски',
        )

        return false
      }
    }

    async function _recoverBoard(
      board: BoardModel,
      workspaceId: string,
    ): Promise<IResponseWithLog<BoardModel[]>> {
      if (!board) throw new Error('Нет доски для восстановления')
      if (_recoveringBoards.value.has(board.id))
        throw new Error('Доска уже в процессе восстановления')

      _recoverBoardsError.value.delete(board.id)

      try {
        _updateBoardsInStore([board]) // Optimistic update

        _recoveringBoards.value.add(board.id)

        const coreAction = () => recoverBoardService(board.id, workspaceId)

        const recoverResult = await requestQueueService.enqueue(board.id, coreAction)
        const recoveredBoards = recoverResult.data
        const recoveredBoard = recoveredBoards.find((b) => b.id === board.id)

        if (!recoveredBoard) throw new Error('Сервер не вернул восстановленную доску')

        return {
          data: recoveredBoards,
          logId: recoverResult.logId,
        }
      } catch (e) {
        if (e instanceof BackendError) {
          _recoverBoardsError.value.set(board.id, e)
        } else if (e instanceof HttpError) {
          _recoverBoardsError.value.set(board.id, e)

          if (e.status === 401) {
          }
        } else {
          _recoverBoardsError.value.set(
            board.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }

        throw e
      } finally {
        _recoveringBoards.value.delete(board.id)
      }
    }

    async function recoverBoard(board: BoardModel): Promise<BoardModel | false> {
      if (!board || _recoveringBoards.value.has(board.id)) return false

      try {
        const recoverResult = await _recoverBoard(board, activeWorkspace.value.id)
        const recoveredBoards = recoverResult.data
        const recoveredBoard = recoveredBoards.find((b) => b.id === board.id) as BoardModel

        _updateBoardsInStore(recoveredBoards)

        toast.success('Доска успешно восстановлена', {
          action: {
            label: 'Отменить',
            onClick: () => {
              if (recoverResult.logId) LOG_STORE.undo(recoverResult.logId)
            },
          },
        })

        return recoveredBoard
      } catch {
        toast.error(
          _recoverBoardsError.value.get(board.id)?.message || 'Ошибка при восстановлении доски',
        )

        return false
      }
    }

    async function _cloneBoard(board: BoardModel): Promise<IResponseWithLog<BoardModel>> {
      if (!board) throw new Error('Нет доски для копирования')
      if (_cloningBoards.value.has(board.id)) throw new Error('Доска уже в процессе копирования')

      _cloneBoardsError.value.delete(board.id)

      try {
        _cloningBoards.value.add(board.id)

        const coreAction = () => cloneBoardService(board.id, board.workspaceId)

        const cloneResult = await requestQueueService.enqueue(board.id, coreAction)
        const clonedBoards = cloneResult.data

        if (!clonedBoards[0]) throw new Error('Сервер не вернул новую доску')

        return {
          data: clonedBoards[0],
          logId: cloneResult.logId,
        }
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
      if (!board || _cloningBoards.value.has(board.id)) return false

      try {
        const result = await _cloneBoard(board)
        const clonedBoard = result.data

        _updateBoardsInStore([clonedBoard])

        toast.success('Доска успешно скопирована', {
          action: {
            label: 'Отменить',
            onClick: () => {
              if (result.logId) LOG_STORE.undo(result.logId)
            },
          },
        })

        return clonedBoard
      } catch {
        toast.error(
          _cloneBoardsError.value.get(board.id)?.message || 'Ошибка при копировании доски',
        )

        return false
      }
    }

    async function moveBoard(boardId: string, newWorkspaceId: string) {
      if (!boardId || _movingBoards.value.has(boardId)) return false

      const board = boards.value.find((b) => b.id === boardId)
      const workspace = WORKSPACE_STORE.getWorkspaceById(newWorkspaceId)

      if (!workspace || !board) return false

      const newBoard: BoardModel = {
        ...board,
        workspaceId: newWorkspaceId,
        workspaceName: workspace.name,
      }

      try {
        _movingBoards.value.add(board.id)

        const result = await _updateBoard(newBoard, newWorkspaceId)
        const movedBoard = result.data

        _updateBoardsInStore([movedBoard])

        toast.success('Доска успешно перемещена', {
          action: {
            label: 'Отменить',
            onClick: () => {
              if (result.logId) LOG_STORE.undo(result.logId)
            },
          },
        })

        return result
      } catch {
        toast.error(_editBoardsError.value.get(board.id)?.message || 'Ошибка при перемещении доски')

        return false
      } finally {
        _movingBoards.value.delete(board.id)
      }
    }

    function integrateBoards(rawBoards: IBoard[]) {
      if (!rawBoards || rawBoards.length === 0) return
      const newModels = rawBoards.map((raw) => transformBoard(raw))

      for (const newModel of newModels) {
        const existingIndex = boards.value.findIndex((b) => b.id === newModel.id)

        if (existingIndex !== -1) {
          Object.assign(boards.value[existingIndex], newModel)
        } else {
          boards.value.push(newModel)
        }
      }
    }

    async function makeFavorite(board: BoardModel) {
      const newBoard = { ...board, isFavorite: !board.isFavorite }
      const savedBoard = _.cloneDeep(boards.value.find((c) => c.id === board.id))

      if (savedBoard) _updateBoardsInStore([savedBoard])

      try {
        _addingToFavoritesBoards.value.add(board.id)

        const result = await _updateBoard(newBoard, board.workspaceId)
        const updatedBoard = result.data

        _updateBoardsInStore([updatedBoard])

        toast.success('Доска успешно добавлена в избранное', {
          action: {
            label: 'Отменить',
            onClick: () => {
              if (result.logId) LOG_STORE.undo(result.logId)
            },
          },
        })

        return result
      } catch {
        if (savedBoard) _updateBoardsInStore([savedBoard])

        toast.error(
          _editBoardsError.value.get(board.id)?.message ||
            'Ошибка при добавлении доски в избранное',
        )

        return false
      } finally {
        _addingToFavoritesBoards.value.delete(board.id)
      }
    }

    function clearBoardToEdit() {
      boardToEdit.value = null
    }

    function openBoardToEdit(board: IBoard) {
      const boardOriginal = boards.value.find((b) => b.id === board.id)
      if (!boardOriginal) return

      boardToEdit.value = boardOriginal

      UI_STORE.openEditBoardModal()
    }

    function deleteFromStore(boardIds: string[]) {
      boards.value = boards.value.filter((b) => !boardIds.includes(b.id))
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
      if (payload.isFavorite !== undefined && board.isFavorite !== payload.isFavorite) return true
      if (payload.order !== undefined && board.order !== payload.order) return true

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

    const isLoadingBoardsCount = computed((): boolean => {
      return _isLoadingBoardsCount.value
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
      if (!activeWorkspace.value) return []

      return boards.value
        .filter((board) => board.workspaceId === activeWorkspace.value.id && !board.isDeleted)
        .sort((a, b) => {
          return a.order - b.order
        })
    })

    const getBoardsByWorkspaceId = computed(() => (workspaceId: string): BoardModel[] => {
      return boards.value
        .filter((board) => board.workspaceId === workspaceId && !board.isDeleted)
        .sort((a, b) => {
          return a.order - b.order
        })
    })

    const getAllBoardsByWorkspaceId = computed(() => (workspaceId: string): BoardModel[] => {
      return boards.value
        .filter((board) => board.workspaceId === workspaceId)
        .sort((a, b) => {
          return a.order - b.order
        })
    })

    const getActiveBoard = computed((): BoardModel | null => {
      return activeBoard.value
    })

    const getActiveWorkspaceFavoriteBoards = computed((): BoardModel[] => {
      if (!activeWorkspace.value) return []

      return getActiveWorkspaceBoards.value.filter(
        (board) => board.isFavorite && board.isDeleted === false,
      )
    })

    const getArchivedBoards = computed((): IBoard[] => {
      return boards.value
        .filter((board) => board.isDeleted && !board.isDeletedExternal)
        .sort((a, b) => {
          if (!a.deletedTime || !b.deletedTime) return a.updatedAt.getTime() - b.updatedAt.getTime()

          return b.deletedTime.getTime() - a.deletedTime.getTime()
        })
    })

    const getArchivedBoardsByName = computed(() => (name: string): IBoard[] => {
      return getArchivedBoards.value.filter((board) =>
        board.name.toLowerCase().startsWith(name.toLowerCase()),
      )
    })

    function getBoardById(boardId: string): Nullable<BoardModel> {
      const board = boards.value.find((b) => b.id === boardId && !b.isDeleted)

      return board || null
    }

    function getOtherBoards(boardId: string): BoardModel[] {
      return boards.value
        .filter((board) => board.id !== boardId && !board.isDeleted)
        .sort((a, b) => {
          return a.order - b.order
        })
    }

    function $reset() {}

    return {
      // State
      boards,
      boardToEdit,
      boardsCount,
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
      isLoadingBoardsCount,
      getActiveWorkspaceFavoriteBoards,
      getActiveBoard,
      getOtherBoards,
      getArchivedBoards,
      getArchivedBoardsByName,
      getBoardsByWorkspaceId,
      getAllBoardsByWorkspaceId,

      // Actions
      loadBoards,
      loadBoardsCount,
      loadArchivedBoards,
      selectBoard,
      addBoardToWorkspace,
      updateBoard,
      deleteBoard,
      archiveBoard,
      recoverBoard,
      cloneBoard,
      moveBoard,
      makeFavorite,
      getBoardById,
      integrateBoards,
      resetBoardSelection,
      clearBoardToEdit,
      openBoardToEdit,
      deleteFromStore,

      $reset,
    }
  })(pinia)
}
