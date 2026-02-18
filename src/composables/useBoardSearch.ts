import { computed, type Ref } from 'vue'
import { useTasks } from '@/composables/tasks/queries/useTasks'
import { useCategories } from '@/composables/categories/queries/useCategories'

export function useBoardSearch(searchQuery: Ref<string>, boardId: Ref<string | null>) {
  const isLoadNeeded = computed(() => searchQuery.value.trim().length > 0)

  const { data: tasksData, isLoading: isTasksPending } = useTasks(boardId, isLoadNeeded)
  const { data: categoriesData, isLoading: isCategoriesPending } = useCategories(
    boardId,
    isLoadNeeded,
  )

  const tasks = computed(() => tasksData.value || [])
  const categories = computed(() => categoriesData.value || [])

  const filterByName = <T extends { name: string }>(list: T[] | undefined) => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!list) return []
    if (!query) return list
    return list.filter((item) => item.name.toLowerCase().includes(query))
  }

  const filteredTasks = computed(() => filterByName([...tasks.value]))
  const filteredCategories = computed(() => filterByName([...categories.value]))

  return {
    tasks: filteredTasks,
    categories: filteredCategories,
    isEmpty: computed(
      () => filteredTasks.value.length === 0 && filteredCategories.value.length === 0,
    ),
    isPending: computed(() => isTasksPending.value || isCategoriesPending.value),
  }
}
