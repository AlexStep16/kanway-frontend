import { fetchBoards } from '~/services/board'
import { fetchWorkspaces } from '~/services/workspace'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $queryClient } = useNuxtApp()

  // 1. Получаем параметры из текущего URL
  // В Nuxt параметры называются так же, как файлы: [workspaceId] и [[boardId]]
  const urlWorkspaceId = to.params.workspaceId as string | undefined
  const urlBoardId = to.params.boardId as string | undefined
  const currentPath = to.path

  try {
    // ==========================================
    // 1. ЗАГРУЗКА И ВАЛИДАЦИЯ WORKSPACE
    // ==========================================
    const workspaces = await $queryClient.fetchQuery({
      queryKey: workspaceKeys.lists(),
      queryFn: fetchWorkspaces,
    })

    if (!workspaces || workspaces.length === 0) {
      return navigateTo('/welcome')
    }

    const savedWorkspaceId = localStorage.getItem('activeWorkspaceId')
    let targetWorkspaceId = urlWorkspaceId

    const isUrlWorkspaceValid =
      targetWorkspaceId && workspaces.some((w) => w.id === targetWorkspaceId)

    if (!isUrlWorkspaceValid) {
      const isSavedWorkspaceValid =
        savedWorkspaceId && workspaces.some((w) => w.id === savedWorkspaceId)

      targetWorkspaceId = isSavedWorkspaceValid ? savedWorkspaceId! : workspaces[0]!.id
    }

    // ==========================================
    // 2. ЗАГРУЗКА И ВАЛИДАЦИЯ BOARD
    // ==========================================
    const boards = await $queryClient.fetchQuery({
      queryKey: boardKeys.byWorkspace(targetWorkspaceId!),
      queryFn: () => fetchBoards(targetWorkspaceId!),
    })

    const savedBoardId = localStorage.getItem('activeBoardId')
    let targetBoardId: string | null = urlBoardId || null

    const isUrlBoardValid = targetBoardId && boards.some((b) => b.id === targetBoardId)

    if (!isUrlBoardValid) {
      const isSavedBoardValid = savedBoardId && boards.some((b) => b.id === savedBoardId)

      // Проверяем, что сохраненная доска принадлежит ВЫБРАННОМУ воркспейсу
      // (Это важная проверка, чтобы не открыть доску из другого пространства)
      targetBoardId = isSavedBoardValid ? savedBoardId! : boards[0]?.id || null
    }

    // ==========================================
    // 3. ФОРМИРОВАНИЕ ПРАВИЛЬНОГО ПУТИ И РЕДИРЕКТ
    // ==========================================
    let idealPath = `/workspace/${targetWorkspaceId}`
    if (targetBoardId) {
      idealPath += `/${targetBoardId}`
    }

    // Убираем trailing slash для корректного сравнения
    const normalizedCurrentPath = currentPath.replace(/\/$/, '')

    if (normalizedCurrentPath !== idealPath) {
      return navigateTo(idealPath, { replace: true })
    }

    // Если мы уже на идеальном пути, сохраняем ID в LS для следующих заходов
    localStorage.setItem('activeWorkspaceId', targetWorkspaceId!)
    if (targetBoardId) {
      localStorage.setItem('activeBoardId', targetBoardId)
    }
  } catch (error) {
    console.error('Workspace logic error:', error)
    // В случае критической ошибки (например, 401),
    // наше глобальное auth-gate мидлваре само перекинет на /auth
  }
})
