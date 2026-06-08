export function useArchivedSearch(searchQuery: Ref<string>) {
  const isLoadNeeded = computed(() => searchQuery.value.trim().length > 0)

  const { data: archivedTasksData } = useArchivedTasks(isLoadNeeded)
  const { data: archivedColumnsData } = useArchivedColumns(isLoadNeeded)

  const archivedTasks = computed(() => archivedTasksData.value || [])
  const archivedColumns = computed(() => archivedColumnsData.value || [])

  const filterByName = <T extends { name: string }>(list: T[] | undefined) => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!list) return []
    if (!query) return list
    return list.filter((item) => item.name.toLowerCase().includes(query))
  }

  const filteredArchivedTasks = computed(() => filterByName([...archivedTasks.value]))
  const filteredArchivedColumns = computed(() => filterByName([...archivedColumns.value]))

  return {
    tasks: filteredArchivedTasks,
    columns: filteredArchivedColumns,
    isEmpty: computed(
      () => filteredArchivedTasks.value.length === 0 && filteredArchivedColumns.value.length === 0,
    ),
  }
}
