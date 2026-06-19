import { fetchBoards } from '~/services/board'
import { fetchWorkspaces } from '~/services/workspace'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { $queryClient } = useNuxtApp()
  const workspaceStore = useWorkspaceStore()
  const boardStore = useBoardStore()
  const uiStore = useUIStore()

  const urlWorkspaceId = to.params.workspaceId as string | undefined
  const urlBoardId = to.params.boardId as string | undefined

  try {
    // 1. Load workspaces
    const workspaces = await $queryClient.fetchQuery({
      queryKey: workspaceKeys.lists(),
      queryFn: fetchWorkspaces,
      staleTime: 1000 * 60 * 5,
    })

    if (!workspaces?.length) return navigateTo('/welcome')

    // 2. Resolve target workspace: URL → saved → first
    const savedWorkspaceId = localStorage.getItem('activeWorkspaceId')
    const targetWorkspace =
      workspaces.find((w) => w.id === urlWorkspaceId) ??
      workspaces.find((w) => w.id === savedWorkspaceId) ??
      workspaces[0]!

    // 3. Load boards for the resolved workspace
    const boards = await $queryClient.fetchQuery({
      queryKey: boardKeys.byWorkspace(targetWorkspace.id),
      queryFn: () => fetchBoards(targetWorkspace.id),
      staleTime: 1000 * 60 * 5,
    })

    // 4. Resolve target board: URL → saved → first → null (chat)
    const savedBoardId = localStorage.getItem('activeBoardId')
    console.log(urlBoardId)
    console.log(savedBoardId)
    const targetBoard =
      boards.find((b) => b.id === urlBoardId) ??
      boards.find((b) => b.id === savedBoardId) ??
      boards[0] ??
      null
    console.log(targetBoard)

    // 5. Build canonical path and redirect if URL doesn't match
    const idealPath = targetBoard
      ? `/workspace/${targetWorkspace.id}/${targetBoard.id}`
      : `/workspace/${targetWorkspace.id}`

    if (to.path.replace(/\/$/, '') !== idealPath) {
      return navigateTo(idealPath, { replace: true })
    }

    // 6. Sync store state — no navigation, no side effects
    workspaceStore.setActiveWorkspace(targetWorkspace.id)

    if (targetBoard) {
      boardStore.setActiveBoard(targetBoard.id)
      uiStore.selectBoard()
    } else {
      boardStore.clearBoard()
      uiStore.selectChat()
    }
  } catch (error) {
    console.error('Workspace middleware error:', error)
    return abortNavigation(error as Error)
  }
})
