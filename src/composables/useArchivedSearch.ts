import { computed, type Ref } from 'vue'
import { useArchivedTasks } from '@/composables/tasks/queries/useArchivedTasks'
import { useArchivedCategories } from '@/composables/categories/queries/useArchivedCategories'

export function useArchivedSearch(searchQuery: Ref<string>) {
  const isLoadNeeded = computed(() => searchQuery.value.trim().length > 0)

  const { data: archivedTasksData } = useArchivedTasks(isLoadNeeded)
  const { data: archivedCategoriesData } = useArchivedCategories(isLoadNeeded)

  const archivedTasks = computed(() => archivedTasksData.value || [])
  const archivedCategories = computed(() => archivedCategoriesData.value || [])

  const filterByName = <T extends { name: string }>(list: T[] | undefined) => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!list) return []
    if (!query) return list
    return list.filter((item) => item.name.toLowerCase().includes(query))
  }

  const filteredArchivedTasks = computed(() => filterByName([...archivedTasks.value]))
  const filteredArchivedCategories = computed(() => filterByName([...archivedCategories.value]))

  return {
    tasks: filteredArchivedTasks,
    categories: filteredArchivedCategories,
    isEmpty: computed(
      () =>
        filteredArchivedTasks.value.length === 0 && filteredArchivedCategories.value.length === 0,
    ),
  }
}
