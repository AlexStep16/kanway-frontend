import { Board } from '@/interfaces/Board'
import { Workspace } from '@/interfaces/Workspace'
import { useBoardDataStore } from '@/stores/boardData'
import { useWorkspaceDataStore } from '@/stores/workspaceData'
import { computed, Ref } from 'vue'

export function useGetters(item: Ref<Workspace | Board>, type: Ref<string>) {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()

  const getWorkspaceItem = computed(() => {
    if (type.value === 'workspace') {
      return item.value as Workspace
    }
    return undefined
  })

  const getBoardItem = computed(() => {
    if (type.value === 'board') {
      return item.value as Board
    }
    return undefined
  })

  const isItemArchiving = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardArchiving(item.value._id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceArchiving(item.value._id)
    }

    return false
  })

  const isItemMoving = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardMoving(item.value._id)
    }

    return false
  })

  const isItemCopying = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardCloning(item.value._id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceCloning(item.value._id)
    }

    return false
  })

  const isItemAddingToFavorites = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardAddingToFavorites(item.value._id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceAddingToFavorites(item.value._id)
    }

    return false
  })

  const isProcessing = computed(() => {
    if (type.value === 'board') {
      return BOARD_STORE.isBoardProcessing(item.value._id)
    } else if (type.value === 'workspace') {
      return WORKSPACE_STORE.isWorkspaceProcessing(item.value._id)
    }

    return false
  })

  function getOtherWorkspaces() {
    return WORKSPACE_STORE.getOtherWorkspaces(WORKSPACE_STORE.getActiveWorkspaceId)
  }

  return {
    getWorkspaceItem,
    getBoardItem,
    isItemArchiving,
    isItemMoving,
    isItemCopying,
    isItemAddingToFavorites,
    isProcessing,

    getOtherWorkspaces,
  }
}
