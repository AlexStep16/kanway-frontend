import WorkspaceModel from '~/models/WorkspaceModel'

export const useWorkspaceStore = defineStore('workspace', () => {
  const activeWorkspaceId = ref<string | null>(null)

  /** Sync state from the route middleware — no navigation, no side effects. */
  function setActiveWorkspace(workspaceId: string) {
    activeWorkspaceId.value = workspaceId
    localStorage.setItem('activeWorkspaceId', workspaceId)
  }

  /**
   * Switch to a workspace from UI actions (sidebar switcher, create/delete/archive).
   * Saves the preference and navigates; the route middleware resolves the correct board.
   */
  async function selectWorkspace(workspace: WorkspaceModel) {
    localStorage.setItem('activeWorkspaceId', workspace.id)
    await navigateTo(`/workspace/${workspace.id}`)
  }

  return {
    activeWorkspaceId,
    setActiveWorkspace,
    selectWorkspace,
  }
})
