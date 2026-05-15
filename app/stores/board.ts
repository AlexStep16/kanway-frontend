import { useWorkspaceStore } from '~/stores/workspace'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { useUIStore } from '~/stores/ui'

export const useBoardStore = defineStore('board', () => {
  const WORKSPACE_STORE = useWorkspaceStore()
  const uiStore = useUIStore()

  const activeBoardId = ref<string | null>(null)
  const activeWorkspaceId = toRef(WORKSPACE_STORE, 'activeWorkspaceId') as Ref<string | null>

  async function selectBoard(board: IBoard, shouldNavigate: boolean = false) {
    if (!board || board.id === activeBoardId.value) return

    if (activeWorkspaceId.value && shouldNavigate) {
      await navigateTo(`/workspace/${activeWorkspaceId.value}/${board.id}`)
    }

    activeBoardId.value = board.id
    localStorage.setItem('activeBoardId', board.id)

    setTimeout(() => (document.title = 'Kanway | ' + board.name), 0)

    uiStore.selectBoard() // Change current UI view to board view
  }

  function resetBoardSelection() {
    activeBoardId.value = null
    localStorage.removeItem('activeBoardId')
  }

  return {
    activeBoardId,

    selectBoard,
    resetBoardSelection,
  }
})
