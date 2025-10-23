import { fetchCategories, saveCategory } from '@services/category'
import { BackendError, HttpError } from '@utils/errors'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { toast } from 'vue-sonner'
import CategoryModel from '@models/CategoryModel'
import { useBoardDataStore } from '@stores/boardData'

type CategoryErrorType = BackendError | HttpError | null

export const useCategoryDataStore = defineStore('categoryData', () => {
  const BOARD_STORE = useBoardDataStore()

  // State
  const categories = ref<Array<CategoryModel>>([])

  // Errors
  const loadCategoriesError = ref<CategoryErrorType>(null)
  const _editCategoriesError = ref<Map<string, CategoryErrorType>>(new Map())

  // Loading
  const _loadingStatusBoards = ref<Map<string, boolean>>(new Map())
  const _loadedBoards = ref<Set<string>>(new Set())
  const _editingCategories = ref<Set<string>>(new Set())
  const _movingCategories = ref<Set<string>>(new Set())

  async function loadCategories(
    boardId: string,
    workspaceId: string,
    force_reload: boolean = false,
  ) {
    if (_loadedBoards.value.has(boardId) && !force_reload) return
    if (_loadingStatusBoards.value.get(boardId)) return
    if (areCategoriesLoaded(boardId) || areCategoriesLoading(boardId)) return

    _loadingStatusBoards.value.set(boardId, true)

    loadCategoriesError.value = null

    try {
      const categoriesPayload = await fetchCategories(workspaceId, boardId)

      categories.value = categories.value.filter((c) => c.boardId !== boardId) // Remove old categories of this board
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

  function _updateCategoriesInStore(newCategories: CategoryModel[]) {
    newCategories.forEach((newCategory) => {
      const category = categories.value.find((c) => c.id === newCategory.id)
      if (category) {
        Object.assign(category, newCategory)
      }
    })
  }

  async function _updateCategory(
    payload: Partial<CategoryModel> & { id: string },
    workspaceId: string,
  ): Promise<CategoryModel> {
    if (!payload) throw new Error('Нет данных для обновления категории')

    _editCategoriesError.value.delete(payload.id)

    try {
      _editingCategories.value.add(payload.id)

      const editResult = await saveCategory(workspaceId, payload)

      const newCategory = editResult.find((c) => c.id === payload.id)

      if (!newCategory) throw new Error('Сервер не вернул обновленную категорию')

      _updateCategoriesInStore(editResult)

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
    payload: Partial<CategoryModel> & { id: string },
    workspaceId: string,
  ): Promise<CategoryModel | false> {
    if (!isCategoryChanged(payload)) return false

    try {
      const result = await _updateCategory(payload, workspaceId)

      toast.success('Категория успешно обновлена')

      return result
    } catch {
      toast.error(
        _editCategoriesError.value.get(payload.id)?.message ||
          'Ошибка при редактировании категории',
      )

      return false
    }
  }

  async function moveCategory(
    category: CategoryModel,
    newBoardId: string,
    workspaceId: string,
  ): Promise<CategoryModel | false> {
    const newCategory: CategoryModel = { ...category, boardId: newBoardId }

    try {
      _movingCategories.value.add(category.id)

      const result = await _updateCategory(newCategory, workspaceId)

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

  function isCategoryChanged(payload: Partial<CategoryModel>): boolean {
    const category = categories.value.find((c) => c.id === payload.id)
    if (!category) return false

    return category.name !== payload.name || category.boardId !== payload.boardId
  }

  function areCategoriesLoading(boardId: string): boolean {
    return _loadingStatusBoards.value.get(boardId) === true
  }

  function areCategoriesLoaded(boardId: string): boolean {
    return _loadedBoards.value.has(boardId)
  }

  const getActiveBoardCategories = computed((): CategoryModel[] => {
    if (!BOARD_STORE.activeBoard) return []

    return categories.value
      .filter((category) => category.boardId === BOARD_STORE.getActiveBoardId)
      .sort((a, b) => {
        return a.order - b.order
      })
  })

  // TO BE FILLED...
  function isCategoryProcessing(categoryId: string): boolean {
    return _editingCategories.value.has(categoryId) || _movingCategories.value.has(categoryId)
  }

  const isCategoryMoving = computed(() => (categoryId: string): boolean => {
    return _movingCategories.value.has(categoryId)
  })

  function $reset() {}

  return {
    // State
    categories,
    getActiveBoardCategories,
    isCategoryMoving,
    isCategoryProcessing,

    // Errors
    loadCategoriesError,

    // Actions
    loadCategories,
    areCategoriesLoading,
    areCategoriesLoaded,
    updateCategory,
    moveCategory,

    $reset,
  }
})
