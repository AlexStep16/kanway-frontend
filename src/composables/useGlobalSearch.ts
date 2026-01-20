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

  const { data: archivedTasks } = useArchivedTasks(isLoadNeeded)
  const { data: archivedCategories } = useArchivedCategories(isLoadNeeded)
  const { data: archivedBoards } = useArchivedBoards(isLoadNeeded)
  const { data: archivedWorkspaces } = useArchivedWorkspaces(isLoadNeeded)

  const { data: tasks } = useTasks(boardId, workspaceId, isLoadNeeded)
  const { data: categories } = useCategories(boardId, workspaceId, isLoadNeeded)
  const { data: boards } = useBoards(workspaceId, isLoadNeeded)
  const { data: workspaces } = useWorkspaces(isLoadNeeded)

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
