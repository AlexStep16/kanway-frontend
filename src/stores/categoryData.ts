import {
  fetchCategories,
  saveCategory,
  archiveCategory as archiveCategoryService,
  recoverCategory as recoverCategoryService,
  cloneCategory as cloneCategoryService,
  createCategory,
  removeCategory,
  transformCategory,
  saveCategories,
  fetchArchivedCategories,
} from '@services/category'
import { BackendError, HttpError } from '@utils/errors'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import { ICategoryState } from '@stores/interfaces/ICategoryState'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { Nullable } from '@/types/utils'
import CategoryModel from '@/models/CategoryModel'
import { v4 } from 'uuid'
import { ICategory } from '@/interfaces/domain/ICategory'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import _ from 'lodash'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { IBoard } from '@/interfaces/domain/IBoard'

type CategoryErrorType = Nullable<BackendError | HttpError>

export const useCategoryDataStore = defineStore('categoryData', () => {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()

  const activeWorkspace = computed(() => WORKSPACE_STORE.getActiveWorkspace as IWorkspace)
  const activeBoard = computed(() => BOARD_STORE.getActiveBoard as IBoard)

  // State
  const categories = ref<Array<ICategoryState>>([])

  // Errors
  const loadCategoriesError = ref<CategoryErrorType>(null)
  const loadArchivedCategoriesError = ref<CategoryErrorType>(null)
  const _addCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())
  const _editManyCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())
  const _editCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())
  const _deleteCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())
  const _archiveCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())
  const _recoverCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())
  const _cloneCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())

  // Loading
  const _loadingStatusBoards = ref<Map<string, boolean>>(new Map())
  const _loadingStatusArchived = ref<boolean>(false)
  const _loadedBoards = ref<Set<string>>(new Set())
  const _isArchivedCategoriesLoaded = ref<boolean>(false)
  const _addingCategories = ref<Set<string>>(new Set())
  const _editingManyCategories = ref<Set<string>>(new Set())
  const _editingCategories = ref<Set<string>>(new Set())
  const _movingCategories = ref<Set<string>>(new Set())
  const _deletingCategories = ref<Set<string>>(new Set())
  const _archivingCategories = ref<Set<string>>(new Set())
  const _recoveringCategories = ref<Set<string>>(new Set())
  const _cloningCategories = ref<Set<string>>(new Set())

  async function loadCategories(
    boardId: string,
    workspaceId: string,
    force_reload: boolean = false,
  ) {
    if (areCategoriesLoaded(boardId) && !force_reload) return
    if (areCategoriesLoading(boardId)) return
    if (_loadingStatusBoards.value.get(boardId)) return

    _loadingStatusBoards.value.set(boardId, true)

    loadCategoriesError.value = null

    try {
      const categoriesPayload = await fetchCategories(workspaceId, boardId)

      categories.value = categories.value.filter((c) => c.boardId !== boardId || c.isDeleted) // Remove old categories of this board
      categories.value.push(...categoriesPayload)
      _loadedBoards.value.add(boardId)

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadCategoriesError.value = e
      } else if (e instanceof HttpError) {
        loadCategoriesError.value = e

        if (e.status === 401) {
        }
      } else {
        loadCategoriesError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadCategoriesError.value.message)

      return false
    } finally {
      _loadingStatusBoards.value.set(boardId, false)
    }
  }

  async function loadArchivedCategories(force_reload: boolean = false) {
    if (_isArchivedCategoriesLoaded.value && !force_reload) return
    if (_loadingStatusArchived.value) return

    loadArchivedCategoriesError.value = null
    _loadingStatusArchived.value = true

    try {
      const categoriesPayload = await fetchArchivedCategories()

      categories.value = categories.value.filter((c) => !c.isDeleted) // Remove old archived categories

      categories.value.push(...categoriesPayload)

      _isArchivedCategoriesLoaded.value = true

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadArchivedCategoriesError.value = e
      } else if (e instanceof HttpError) {
        loadArchivedCategoriesError.value = e

        if (e.status === 401) {
        }
      } else {
        loadArchivedCategoriesError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadArchivedCategoriesError.value.message)

      return false
    } finally {
      _loadingStatusArchived.value = false
    }
  }

  async function _addCategory(
    payload: CategoryModel,
    boardId: string,
  ): Promise<ICategoryState | false> {
    if (!boardId || !payload) return false

    _addCategoriesError.value.delete(payload.id)

    try {
      _addingCategories.value.add(payload.id)
      const board = BOARD_STORE.getBoardById(boardId)

      if (!board) return false

      const newCategories = await createCategory(
        { ...payload, boardName: board.name, workspaceName: activeWorkspace.value.name },
        boardId,
        activeWorkspace.value.id,
      )

      return newCategories[0]
    } catch (e) {
      if (e instanceof BackendError) {
        _addCategoriesError.value.set(payload.id, e)
      } else if (e instanceof HttpError) {
        _addCategoriesError.value.set(payload.id, e)

        if (e.status === 401) {
        }
      } else {
        _addCategoriesError.value.set(
          payload.id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      throw e
    } finally {
      _addingCategories.value.delete(payload.id)
    }
  }

  async function addCategory(
    payload: ICategoryState,
    boardId: string,
  ): Promise<ICategoryState | false> {
    if (!boardId) return false

    try {
      const clonedPayload: ICategoryState = { ...payload }
      cleanStateFields(clonedPayload)

      const result = await _addCategory(clonedPayload, boardId)

      if (result) _updateOrAddCategoriesInStore([result])

      toast.success('Категория успешно создана')

      return result
    } catch {
      toast.error(
        _addCategoriesError.value.get(payload.id)?.message ?? 'Ошибка при создании категории',
      )

      return false
    }
  }

  function addCategoryToStore(boardId: string) {
    if (categories.value.some((c) => c.boardId === boardId && c.isNew)) return null
    const board = BOARD_STORE.getBoardById(boardId)

    if (!board) return null

    const newCategory = new CategoryModel({
      id: 'new-' + v4(),
      name: '',
      workspaceId: activeWorkspace.value.id,
      workspaceName: activeWorkspace.value.name,
      order: getCategoriesByBoardId(boardId).length + 1,
      boardId: board.id,
      boardName: board.name,
      userId: '',
      isDeleted: false,
      isDeletedExternal: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const categoryState: ICategoryState = { ...newCategory, isNew: true }

    categories.value.push(categoryState)

    return categoryState
  }

  function createOrSplice(category: ICategoryState, target: HTMLInputElement) {
    const categoryName = target.value

    category.name = categoryName

    if (category.isNew && category.name.trim() !== '') {
      addCategory(category, activeBoard.value.id)
    } else {
      const index = categories.value.findIndex((c) => c.id === category.id)

      if (index !== -1) {
        categories.value.splice(index, 1)
      }
    }
  }

  function _updateOrAddCategoriesInStore(newCategories: ISingleUpdate<ICategoryState>[]) {
    for (const newCategory of newCategories) {
      const existingCategory = categories.value.find((c) => c.id === newCategory.id)

      if (!existingCategory) {
        if (newCategory.tempId) {
          const existingCategory = categories.value.find((c) => c.id === newCategory.tempId)

          if (existingCategory) {
            Object.assign(existingCategory, newCategory, { isNew: false })
          }
        } else {
          const addedCategory = addCategoryToStore(newCategory!.boardId || '')
          if (addedCategory) Object.assign(addedCategory, newCategory, { isNew: false })
        }
      } else {
        Object.assign(existingCategory, newCategory)
      }
    }
  }

  async function _updateCategories(
    payload: ISingleUpdate<CategoryModel>[],
    workspaceId: string,
    boardId: string,
  ): Promise<ICategoryState[]> {
    if (payload.length === 0) throw new Error('Нет данных для обновления категории')

    try {
      for (const p of payload) {
        _editManyCategoriesError.value.delete(p.id)
        _editingManyCategories.value.add(p.id)
      }

      const coreAction = () => saveCategories(workspaceId, boardId, payload)

      const editManyResult = await requestQueueService.enqueueBulk(
        payload.map((p) => p.id),
        coreAction,
      )
      const newCategories = editManyResult.filter((c) => payload.some((p) => p.id === c.id))

      if (newCategories.length === 0) throw new Error('Сервер не вернул обновленные категории')

      return newCategories
    } catch (e) {
      if (e instanceof BackendError) {
        for (const p of payload) {
          _editManyCategoriesError.value.set(p.id, e)
        }
      } else if (e instanceof HttpError) {
        for (const p of payload) {
          _editManyCategoriesError.value.set(p.id, e)
        }

        if (e.status === 401) {
        }
      } else {
        for (const p of payload) {
          _editManyCategoriesError.value.set(
            p.id,
            new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
          )
        }
      }

      throw e
    } finally {
      for (const p of payload) {
        _editingManyCategories.value.delete(p.id)
      }
    }
  }

  async function _updateCategory(
    payload: ISingleUpdate<ICategoryState>,
    workspaceId: string,
    boardId: string,
  ): Promise<ICategoryState> {
    if (!payload) throw new Error('Нет данных для обновления категории')

    _editCategoriesError.value.delete(payload.id)

    try {
      _editingCategories.value.add(payload.id)

      const coreAction = () => saveCategory(workspaceId, boardId, payload)

      const editResult = await requestQueueService.enqueue(payload.id, coreAction)

      const newCategory = editResult.find((c) => c.id === payload.id)

      if (!newCategory) throw new Error('Сервер не вернул обновленную категорию')

      return newCategory
    } catch (e) {
      if (e instanceof BackendError) {
        _editCategoriesError.value.set(payload.id, e)
      } else if (e instanceof HttpError) {
        _editCategoriesError.value.set(payload.id, e)

        if (e.status === 401) {
        }
      } else {
        _editCategoriesError.value.set(
          payload.id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      throw e
    } finally {
      _editingCategories.value.delete(payload.id)
    }
  }

  async function updateCategory(
    payload: ISingleUpdate<ICategoryState>,
    boardId: string,
    workspaceId: string,
    isOptimisticUpdate: boolean = false,
  ): Promise<ICategoryState | false> {
    if (!isCategoryChanged(payload)) return false
    const savedCategory = _.cloneDeep(categories.value.find((c) => c.id === payload.id))

    try {
      if (isOptimisticUpdate && savedCategory) {
        _updateOrAddCategoriesInStore([payload])
      }

      const clonedPayload: ISingleUpdate<ICategoryState> = { ...payload }
      cleanStateFields(clonedPayload)

      const result = await _updateCategory(clonedPayload, workspaceId, boardId)

      _updateOrAddCategoriesInStore([result])

      return result
    } catch {
      if (isOptimisticUpdate && savedCategory) {
        _updateOrAddCategoriesInStore([savedCategory])
      }

      toast.error(
        _editCategoriesError.value.get(payload.id)?.message ||
          'Ошибка при редактировании категории',
      )

      return false
    }
  }

  function cleanStateFields(payload: ICategoryState | ISingleUpdate<ICategoryState>) {
    delete payload.isNew
    delete payload.tempId
  }

  async function updateCategories(
    payload: ISingleUpdate<ICategoryState>[],
    isOptimisticUpdate: boolean = false,
  ): Promise<ICategoryState[] | false> {
    if (payload.length === 0) return false
    const savedCategories: ICategoryState[] = []

    for (const p of payload) {
      const existingCategory = categories.value.find((c) => c.id === p.id)
      if (existingCategory) {
        savedCategories.push(_.cloneDeep(existingCategory))
      }
    }

    try {
      if (isOptimisticUpdate) {
        _updateOrAddCategoriesInStore(payload)
      }

      const clonedPayload = payload.map((p) => {
        const clonedP = { ...p }
        cleanStateFields(clonedP)
        return clonedP
      })

      const result = await _updateCategories(
        clonedPayload,
        activeWorkspace.value.id,
        activeBoard.value.id,
      )

      _updateOrAddCategoriesInStore(result)

      return result
    } catch {
      if (isOptimisticUpdate) {
        _updateOrAddCategoriesInStore(savedCategories)
      }

      toast.error(
        _editManyCategoriesError.value.get(payload[0].id)?.message ||
          'Ошибка при редактировании категории',
      )

      return false
    }
  }

  async function _deleteCategory(category: CategoryModel): Promise<void> {
    if (!category) throw new Error('Нет категории для удаления')

    _deleteCategoriesError.value.delete(category.id)

    try {
      _deletingCategories.value.add(category.id)

      const coreAction = () =>
        removeCategory(category.id, activeWorkspace.value.id, activeBoard.value.id)

      await requestQueueService.enqueue(category.id, coreAction)

      const categoryIndex = categories.value.findIndex((c) => c.id === category.id)
      if (categoryIndex !== -1) {
        categories.value.splice(categoryIndex, 1)
      }
    } catch (e) {
      if (e instanceof BackendError) {
        _deleteCategoriesError.value.set(category.id, e)
      } else if (e instanceof HttpError) {
        _deleteCategoriesError.value.set(category.id, e)

        if (e.status === 401) {
        }
      } else {
        _deleteCategoriesError.value.set(
          category.id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      throw e
    } finally {
      _deletingCategories.value.delete(category.id)
    }
  }

  async function deleteCategory(category: ICategoryState): Promise<boolean> {
    try {
      const clonedCategory: ICategoryState = { ...category }
      cleanStateFields(clonedCategory)

      await _deleteCategory(category)

      toast.success('Категория успешно удалена')

      return true
    } catch {
      toast.error(
        _deleteCategoriesError.value.get(category.id)?.message || 'Ошибка при удалении категории',
      )

      return false
    }
  }

  async function _archiveCategory(
    category: CategoryModel,
    workspaceId: string,
  ): Promise<ICategoryState[]> {
    if (!category) throw new Error('Нет категории для архивирования')

    _archiveCategoriesError.value.delete(category.id)

    try {
      _archivingCategories.value.add(category.id)

      const coreAction = () => archiveCategoryService(category.id, workspaceId, category.boardId)

      const archiveResult = await requestQueueService.enqueue(category.id, coreAction)
      const archivedCategory = archiveResult.find((c) => c.id === category.id) as ICategoryState

      if (!archivedCategory) throw new Error('Сервер не вернул архивированную категорию')

      return archiveResult
    } catch (e) {
      if (e instanceof BackendError) {
        _archiveCategoriesError.value.set(category.id, e)
      } else if (e instanceof HttpError) {
        _archiveCategoriesError.value.set(category.id, e)

        if (e.status === 401) {
        }
      } else {
        _archiveCategoriesError.value.set(
          category.id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      throw e
    } finally {
      _archivingCategories.value.delete(category.id)
    }
  }

  async function archiveCategory(
    category: CategoryModel,
    workspaceId: string,
  ): Promise<ICategoryState | false> {
    try {
      const clonedCategory: ICategoryState = { ...category }
      cleanStateFields(clonedCategory)

      const archiveResult = await _archiveCategory(clonedCategory, workspaceId)
      const archivedCategory = archiveResult.find((c) => c.id === category.id) as ICategoryState

      _updateOrAddCategoriesInStore(archiveResult)

      toast.success('Категория успешно архивирована')

      return archivedCategory
    } catch {
      toast.error(
        _archiveCategoriesError.value.get(category.id)?.message ||
          'Ошибка при архивировании категории',
      )

      return false
    }
  }

  async function _recoverCategory(
    category: CategoryModel,
    workspaceId: string,
  ): Promise<ICategoryState[]> {
    if (!category) throw new Error('Нет категории для восстановления')

    _recoverCategoriesError.value.delete(category.id)

    try {
      _updateOrAddCategoriesInStore([category]) // Optimistic update

      _recoveringCategories.value.add(category.id)

      const coreAction = () => recoverCategoryService(category.id, workspaceId, category.boardId)

      const recoverResult = await requestQueueService.enqueue(category.id, coreAction)
      const recoveredCategory = recoverResult.find((c) => c.id === category.id)

      if (!recoveredCategory) throw new Error('Сервер не вернул восстановленную категорию')

      return recoverResult
    } catch (e) {
      if (e instanceof BackendError) {
        _recoverCategoriesError.value.set(category.id, e)
      } else if (e instanceof HttpError) {
        _recoverCategoriesError.value.set(category.id, e)

        if (e.status === 401) {
        }
      } else {
        _recoverCategoriesError.value.set(
          category.id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      throw e
    } finally {
      _recoveringCategories.value.delete(category.id)
    }
  }

  async function recoverCategory(category: CategoryModel): Promise<ICategoryState | false> {
    try {
      const clonedCategory: ICategoryState = { ...category }
      cleanStateFields(clonedCategory)

      const recoverResult = await _recoverCategory(clonedCategory, activeWorkspace.value.id)
      const recoveredCategory = recoverResult.find((c) => c.id === category.id) as ICategoryState

      _updateOrAddCategoriesInStore(recoverResult)

      toast.success('Категория успешно восстановлена')

      return recoveredCategory
    } catch {
      toast.error(
        _recoverCategoriesError.value.get(category.id)?.message ||
          'Ошибка при восстановлении категории',
      )

      return false
    }
  }

  async function _cloneCategory(
    category: CategoryModel,
    workspaceId: string,
  ): Promise<ICategoryState> {
    if (!category) throw new Error('Нет категории для копирования')

    _cloneCategoriesError.value.delete(category.id)

    try {
      _cloningCategories.value.add(category.id)

      const coreAction = () => cloneCategoryService(category.id, workspaceId, category.boardId)

      const newCategories = await requestQueueService.enqueue(category.id, coreAction)

      if (!newCategories[0]) throw new Error('Сервер не вернул новую категорию')

      return newCategories[0]
    } catch (e) {
      if (e instanceof BackendError) {
        _cloneCategoriesError.value.set(category.id, e)
      } else if (e instanceof HttpError) {
        _cloneCategoriesError.value.set(category.id, e)

        if (e.status === 401) {
        }
      } else {
        _cloneCategoriesError.value.set(
          category.id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      throw e
    } finally {
      _cloningCategories.value.delete(category.id)
    }
  }

  async function cloneCategory(
    category: CategoryModel,
    workspaceId: string,
  ): Promise<ICategoryState | false> {
    try {
      const clonedCategory: ICategoryState = { ...category }
      cleanStateFields(clonedCategory)

      const result = await _cloneCategory(clonedCategory, workspaceId)

      _updateOrAddCategoriesInStore([result])

      toast.success('Категория успешно скопирована')

      return result
    } catch {
      toast.error(
        _cloneCategoriesError.value.get(category.id)?.message || 'Ошибка при копировании категории',
      )

      return false
    }
  }

  async function moveCategory(
    categoryId: string,
    newBoardId: string,
    workspaceId: string,
  ): Promise<ICategoryState | false> {
    const category = categories.value.find((c) => c.id === categoryId)
    const newBoard = BOARD_STORE.getBoardById(newBoardId)

    if (!newBoard || !category) return false

    const newCategory: ICategoryState = {
      ...category,
      boardId: newBoardId,
      boardName: newBoard.name,
    }
    cleanStateFields(newCategory)

    try {
      _movingCategories.value.add(category.id)

      const result = await _updateCategory(newCategory, workspaceId, category.boardId)

      _updateOrAddCategoriesInStore([result])

      toast.success('Категория успешно перемещена')

      return result
    } catch {
      toast.error(
        _editCategoriesError.value.get(category.id)?.message || 'Ошибка при перемещении категории',
      )

      return false
    } finally {
      _movingCategories.value.delete(category.id)
    }
  }

  function integrateCategories(rawCategories: ICategory[]) {
    if (!rawCategories || rawCategories.length === 0) return
    const newModels = rawCategories.map((raw) => transformCategory(raw))

    categories.value.push(...newModels)
  }

  function getCategoryById(categoryId: string): Nullable<ICategoryState> {
    return categories.value.find((c) => c.id === categoryId && !c.isDeleted) || null
  }

  function getCategoriesByBoardId(boardId: string): ICategoryState[] {
    return categories.value.filter((c) => c.boardId === boardId && !c.isDeleted)
  }

  function isCategoryChanged(payload: Partial<ICategoryState>): boolean {
    const category = getCategoryById(payload.id || '')
    if (!category) return false

    if (payload.name !== undefined && category.name !== payload.name) return true
    if (payload.boardId !== undefined && category.boardId !== payload.boardId) return true
    if (payload.order !== undefined && category.order !== payload.order) return true

    return false
  }

  function areCategoriesLoading(boardId: string): boolean {
    return _loadingStatusBoards.value.get(boardId) === true
  }

  function areCategoriesLoaded(boardId: string): boolean {
    return _loadedBoards.value.has(boardId)
  }

  const getActiveBoardCategories = computed((): ICategoryState[] => {
    if (!activeBoard.value) return []

    return categories.value
      .filter((category) => category.boardId === activeBoard.value.id && !category.isDeleted)
      .sort((a, b) => {
        return a.order - b.order
      })
  })

  const getActiveBoardCategoriesByName = computed(() => (name: string): ICategoryState[] => {
    return getActiveBoardCategories.value.filter(
      (category) => category.name.toLowerCase().startsWith(name.toLowerCase()) && !category.isNew,
    )
  })

  const getArchivedCategories = computed((): ICategoryState[] => {
    return categories.value
      .filter((category) => category.isDeleted)
      .sort((a, b) => {
        if (!a.deletedTime || !b.deletedTime) return a.updatedAt.getTime() - b.updatedAt.getTime()

        return b.deletedTime.getTime() - a.deletedTime.getTime()
      })
  })

  function isCategoryProcessing(categoryId: string): boolean {
    return (
      _addingCategories.value.has(categoryId) ||
      _editingCategories.value.has(categoryId) ||
      _movingCategories.value.has(categoryId) ||
      _archivingCategories.value.has(categoryId) ||
      _cloningCategories.value.has(categoryId)
    )
  }

  const isCategoryMoving = computed(() => (categoryId: string): boolean => {
    return _movingCategories.value.has(categoryId)
  })

  const isCategoryArchiving = computed(() => (categoryId: string): boolean => {
    return _archivingCategories.value.has(categoryId)
  })

  const isCategoryCloning = computed(() => (categoryId: string): boolean => {
    return _cloningCategories.value.has(categoryId)
  })

  const isCategoryAdding = computed(() => (categoryId: string): boolean => {
    return _addingCategories.value.has(categoryId)
  })

  function $reset() {}

  return {
    // State
    categories,
    getActiveBoardCategories,
    isCategoryMoving,
    isCategoryProcessing,
    isCategoryArchiving,
    isCategoryCloning,
    isCategoryAdding,
    getActiveBoardCategoriesByName,
    getArchivedCategories,

    // Errors
    loadCategoriesError,

    // Actions
    loadCategories,
    addCategoryToStore,
    areCategoriesLoading,
    areCategoriesLoaded,
    updateCategory,
    updateCategories,
    moveCategory,
    deleteCategory,
    archiveCategory,
    recoverCategory,
    loadArchivedCategories,
    cloneCategory,
    getCategoryById,
    getCategoriesByBoardId,
    createOrSplice,
    integrateCategories,

    $reset,
  }
})
