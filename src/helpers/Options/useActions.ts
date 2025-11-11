import { useCategoryDataStore } from '@stores/categoryData'
import BoardModel from '@models/BoardModel'
import CategoryModel from '@models/CategoryModel'
import WorkspaceModel from '@models/WorkspaceModel'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { Ref } from 'vue'

export function useActions(
  item: Ref<WorkspaceModel | BoardModel | CategoryModel>,
  edit_type: Ref<'board' | 'workspace' | 'chat' | 'category'>,
  closeDropdown: () => void,
) {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()
  const CATEGORY_STORE = useCategoryDataStore()

  async function archiveItem() {
    if (edit_type.value === 'board') {
      await BOARD_STORE.archiveBoard(item.value as BoardModel, WORKSPACE_STORE.getActiveWorkspaceId)
    } else if (edit_type.value === 'workspace') {
      await WORKSPACE_STORE.archiveWorkspace(item.value as WorkspaceModel)
    } else if (edit_type.value === 'category') {
      await CATEGORY_STORE.archiveCategory(
        item.value as CategoryModel,
        WORKSPACE_STORE.getActiveWorkspaceId,
      )
    }

    closeDropdown()
  }

  async function cloneItem() {
    if (edit_type.value === 'board') {
      await BOARD_STORE.cloneBoard(item.value as BoardModel)
    } else if (edit_type.value === 'workspace') {
      await WORKSPACE_STORE.cloneWorkspace(item.value as WorkspaceModel)
    } else if (edit_type.value === 'category') {
      await CATEGORY_STORE.cloneCategory(
        item.value as CategoryModel,
        WORKSPACE_STORE.getActiveWorkspaceId,
      )
    }

    closeDropdown()
  }

  async function moveItem(newItemId: string) {
    if (edit_type.value === 'board') {
      await BOARD_STORE.moveBoard(item.value as BoardModel, newItemId)
    } else if (edit_type.value === 'category') {
      await CATEGORY_STORE.moveCategory(
        item.value.id,
        newItemId,
        WORKSPACE_STORE.getActiveWorkspaceId,
      )
    }

    closeDropdown()
  }

  async function makeFavorite() {
    if (edit_type.value === 'board') {
      await BOARD_STORE.makeFavorite(item.value as BoardModel)
    } else if (edit_type.value === 'workspace') {
      await WORKSPACE_STORE.makeFavorite(item.value as WorkspaceModel)
    }

    closeDropdown()
  }

  return {
    archiveItem,
    cloneItem,
    moveItem,
    makeFavorite,
  }
}
