import { useCategoryDataStore } from '@stores/categoryData'
import BoardModel from '@models/BoardModel'
import CategoryModel from '@models/CategoryModel'
import WorkspaceModel from '@models/WorkspaceModel'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { computed, Ref } from 'vue'
import ChatModel from '@/models/ChatModel'

export function useGetters(
  item: Ref<WorkspaceModel | BoardModel | CategoryModel | ChatModel>,
  type: Ref<string>,
) {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const CATEGORY_STORE = useCategoryDataStore()

  const getWorkspaceItem = computed(() => {
    if (type.value === 'workspace') {
      return item.value as WorkspaceModel
    }
    return undefined
  })

  const getBoardItem = computed(() => {
    if (type.value === 'board') {
      return item.value as BoardModel
    }
    return undefined
  })

  const isItemArchiving = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardArchiving(item.value.id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceArchiving(item.value.id)
    }

    return false
  })

  const isItemMoving = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardMoving(item.value.id)
    } else if (type.value === 'category') {
      return CATEGORY_STORE.isCategoryMoving(item.value.id)
    }

    return false
  })

  const isItemCopying = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardCloning(item.value.id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceCloning(item.value.id)
    }

    return false
  })

  const isItemAddingToFavorites = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardAddingToFavorites(item.value.id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceAddingToFavorites(item.value.id)
    }

    return false
  })

  const isProcessing = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardProcessing(item.value.id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceProcessing(item.value.id)
    } else if (type.value === 'category') {
      return CATEGORY_STORE.isCategoryProcessing(item.value.id)
    }

    return false
  })

  return {
    getWorkspaceItem,
    getBoardItem,
    isItemArchiving,
    isItemMoving,
    isItemCopying,
    isItemAddingToFavorites,
    isProcessing,
  }
}
