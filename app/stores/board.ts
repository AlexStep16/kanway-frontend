import { useWorkspaceStore } from '~/stores/workspace'
import { useUIStore } from '~/stores/ui'

export const useBoardStore = defineStore('board', () => {
  const workspaceStore = useWorkspaceStore()
  const uiStore = useUIStore()

  const activeBoardId = ref<string | null>(null)

  /** Sync state from the route middleware — no navigation, no side effects. */
  function setActiveBoard(boardId: string) {
    activeBoardId.value = boardId
    localStorage.setItem('activeBoardId', boardId)
  }

  /** Clear board state — called by middleware when the workspace has no boards. */
  function clearBoard() {
    activeBoardId.value = null
    localStorage.removeItem('activeBoardId')
  }

  /**
   * Navigate to a board from UI actions (sidebar, create/archive/recover).
   * The route middleware handles all state sync after navigation.
   * If the URL already matches (e.g. mobile chat desynced the store), sync state directly.
   */
  async function selectBoard(boardId: string) {
    const workspaceId = workspaceStore.activeWorkspaceId
    if (!workspaceId) return

    const idealPath = `/workspace/${workspaceId}/${boardId}`
    const route = useRoute()

    if (route.path === idealPath) {
      // Already at the right URL — middleware won't fire, sync state manually
      setActiveBoard(boardId)
      uiStore.selectBoard()
      return
    }

    await navigateTo(idealPath)
  }

  /**
   * Navigate to the workspace root (chat view) when the active board is gone.
   * Use when the current board has been archived or deleted.
   */
  async function navigateToChat() {
    const workspaceId = workspaceStore.activeWorkspaceId
    if (!workspaceId) return
    await navigateTo(`/workspace/${workspaceId}`)
  }

  return {
    activeBoardId,

    setActiveBoard,
    clearBoard,
    selectBoard,
    navigateToChat,
  }
})
