import { boardKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { fetchBoards } from '@/services/board'
import { fetchWorkspaces } from '@/services/workspace'
import { redirect } from 'vike/abort'

export async function handleWorkspaceRoute(
  urlWorkspaceId: string | null,
  urlBoardId: string | null,
  currentPath: string,
): Promise<{ workspaceId: string; boardId: string | null }> {
  // ==========================================
  // 1. ЗАГРУЗКА И ВАЛИДАЦИЯ WORKSPACE
  // ==========================================
  const workspaces = await queryClient.fetchQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: fetchWorkspaces,
  })

  // Если воркспейсов вообще нет, ничего не делаем (возможно, нужно показать UI создания)
  if (!workspaces || workspaces.length === 0) {
    throw redirect('/welcome')
  }

  const savedWorkspaceId = localStorage.getItem('activeWorkspaceId')
  let targetWorkspaceId = urlWorkspaceId

  // Проверяем, существует ли воркспейс из URL в загруженном списке
  const isUrlWorkspaceValid =
    targetWorkspaceId && workspaces.some((w) => w.id === targetWorkspaceId)

  if (!isUrlWorkspaceValid) {
    // Если URL пустой (/workspace) или битый (/workspace/invalid-id)
    // Проверяем сохраненный в LS
    const isSavedWorkspaceValid =
      savedWorkspaceId && workspaces.some((w) => w.id === savedWorkspaceId)

    // Берем из LS, если он валиден, иначе берем самый первый из списка
    targetWorkspaceId = isSavedWorkspaceValid ? savedWorkspaceId : workspaces[0].id
  }

  if (!targetWorkspaceId) targetWorkspaceId = workspaces[0].id

  // ==========================================
  // 2. ЗАГРУЗКА И ВАЛИДАЦИЯ BOARD
  // ==========================================
  // Загружаем доски именно для выбранного targetWorkspaceId
  const boards = await queryClient.fetchQuery({
    queryKey: boardKeys.byWorkspace(targetWorkspaceId), // Предполагаю, что ключ принимает ID
    queryFn: () => fetchBoards(targetWorkspaceId), // Исправил queryFn на fetchBoards
  })

  const savedBoardId = localStorage.getItem('activeBoardId')
  let targetBoardId: string | null = urlBoardId

  // Проверяем, существует ли доска из URL в выбранном пространстве
  const isUrlBoardValid = targetBoardId && boards.some((b) => b.id === targetBoardId)

  if (!isUrlBoardValid) {
    // Если доски в URL нет или она не принадлежит этому пространству
    const isSavedBoardValid = savedBoardId && boards.some((b) => b.id === savedBoardId)

    // Если в LS валидная доска для ЭТОГО пространства - берем её. Иначе - первую доску пространства.
    targetBoardId = isSavedBoardValid ? savedBoardId : boards.length > 0 ? boards[0].id : null
  }

  // ==========================================
  // 3. ФОРМИРОВАНИЕ ПРАВИЛЬНОГО ПУТИ И РЕДИРЕКТ
  // ==========================================
  let idealPath = `/workspace/${targetWorkspaceId}`
  if (targetBoardId) {
    idealPath += `/${targetBoardId}`
  }

  // Если текущий путь не совпадает с идеальным — делаем редирект!
  // Например: зашли на /workspace, а идеальный /workspace/123/456
  if (currentPath !== idealPath) {
    // Удаляем trailing slash на случай, если currentPath === '/workspace/'
    if (currentPath.replace(/\/$/, '') !== idealPath) {
      throw redirect(idealPath)
    }
  }

  return {
    workspaceId: targetWorkspaceId,
    boardId: targetBoardId,
  }
}
