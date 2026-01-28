import { computed, type Ref } from 'vue'
import { useTasks } from '@/composables/tasks/queries/useTasks'
import { useArchivedTasks } from '@/composables/tasks/queries/useArchivedTasks'
import { useCategories } from '@/composables/categories/queries/useCategories'
import { useArchivedCategories } from '@/composables/categories/queries/useArchivedCategories'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { useArchivedBoards } from '@/composables/boards/queries/useArchivedBoards'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { useArchivedWorkspaces } from '@/composables/workspaces/queries/useArchivedWorkspaces'

export function useGlobalSearch(
  searchQuery: Ref<string>,
  boardId: Ref<string | null>,
  workspaceId: Ref<string | null>,
) {
  // 1. Подключаем нужные запросы
  const isLoadNeeded = computed(() => searchQuery.value.trim().length > 2)

  const { data: archivedTasksData } = useArchivedTasks(isLoadNeeded)
  const { data: archivedCategoriesData } = useArchivedCategories(isLoadNeeded)
  const { data: archivedBoardsData } = useArchivedBoards(isLoadNeeded)
  const { data: archivedWorkspacesData } = useArchivedWorkspaces(isLoadNeeded)

  const { data: tasksData } = useTasks(boardId, isLoadNeeded)
  const { data: categoriesData } = useCategories(boardId, isLoadNeeded)
  const { data: boardsData } = useBoards(workspaceId, isLoadNeeded)
  const { data: workspacesData } = useWorkspaces(isLoadNeeded)

  const archivedTasks = computed(() => archivedTasksData.value || [])
  const archivedCategories = computed(() => archivedCategoriesData.value || [])
  const archivedBoards = computed(() => archivedBoardsData.value || [])
  const archivedWorkspaces = computed(() => archivedWorkspacesData.value || [])

  const tasks = computed(() => tasksData.value || [])
  const categories = computed(() => categoriesData.value || [])
  const boards = computed(() => boardsData.value || [])
  const workspaces = computed(() => workspacesData.value || [])

  // Вспомогательная функция для фильтрации по имени
  const filterByName = <T extends { name: string }>(list: T[] | undefined) => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!list) return []
    if (!query) return list
    return list.filter((item) => item.name.toLowerCase().includes(query))
  }

  // 2. Создаем производные данные (фильтрованные списки)
  const filteredArchivedTasks = computed(() =>
    filterByName([...archivedTasks.value, ...tasks.value]),
  )
  const filteredArchivedCategories = computed(() =>
    filterByName([...archivedCategories.value, ...categories.value]),
  )
  const filteredArchivedBoards = computed(() =>
    filterByName([...archivedBoards.value, ...boards.value]),
  )
  const filteredArchivedWorkspaces = computed(() =>
    filterByName([...archivedWorkspaces.value, ...workspaces.value]),
  )

  return {
    tasks: filteredArchivedTasks,
    boards: filteredArchivedBoards,
    workspaces: filteredArchivedWorkspaces,
    categories: filteredArchivedCategories,
    // Можно добавить общий флаг "ничего не найдено"
    isEmpty: computed(
      () => filteredArchivedTasks.value.length === 0 && filteredArchivedBoards.value.length === 0,
    ),
  }
}
