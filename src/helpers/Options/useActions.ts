import { Board } from '@/interfaces/Board'
import { Workspace } from '@/interfaces/Workspace'
import { useBoardDataStore } from '@/stores/boardData'
import { useWorkspaceDataStore } from '@/stores/workspaceData'
import { Ref } from 'vue'

export function useActions(
  item: Ref<Workspace | Board>,
  edit_type: Ref<'board' | 'workspace' | 'chat' | 'category'>,
  closeDropdown: () => void,
) {
  const BOARD_STORE = useBoardDataStore()
  const WORKSPACE_STORE = useWorkspaceDataStore()

  async function archiveItem() {
    if (edit_type.value === 'board') {
      await BOARD_STORE.archiveBoard(item.value as Board, WORKSPACE_STORE.getActiveWorkspaceId)
    } else if (edit_type.value === 'workspace') {
      await WORKSPACE_STORE.archiveWorkspace(item.value as Workspace)
    }

    closeDropdown()
  }

  async function cloneItem() {
    if (edit_type.value === 'board') {
      await BOARD_STORE.cloneBoard(item.value as Board)
    } else if (edit_type.value === 'workspace') {
      await WORKSPACE_STORE.cloneWorkspace(item.value as Workspace)
    }

    closeDropdown()
  }

  async function moveBoard(new_workspace_id: string) {
    if (edit_type.value === 'board') {
      await BOARD_STORE.moveBoard(item.value as Board, new_workspace_id)
    }

    closeDropdown()
  }

  async function makeFavorite() {
    if (edit_type.value === 'board') {
      await BOARD_STORE.makeFavorite(item.value as Board)
    } else if (edit_type.value === 'workspace') {
      await WORKSPACE_STORE.makeFavorite(item.value as Workspace)
    }

    closeDropdown()
  }

  return {
    archiveItem,
    cloneItem,
    moveBoard,
    makeFavorite,
  }
}
