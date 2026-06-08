export function useBoardSearch(searchQuery: Ref<string>, boardId: Ref<string | null>) {
  const isLoadNeeded = computed(() => searchQuery.value.trim().length > 0)

  const { data: tasksData, isLoading: isTasksPending } = useTasks(boardId, isLoadNeeded)
  const { data: columnsData, isLoading: isColumnsPending } = useColumns(boardId, isLoadNeeded)

  const tasks = computed(() => tasksData.value || [])
  const columns = computed(() => columnsData.value || [])

  const filterByName = <T extends { name: string }>(list: T[] | undefined) => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!list) return []
    if (!query) return list
    return list.filter((item) => item.name.toLowerCase().includes(query))
  }

  const filteredTasks = computed(() => filterByName([...tasks.value]))
  const filteredColumns = computed(() => filterByName([...columns.value]))

  return {
    tasks: filteredTasks,
    columns: filteredColumns,
    isEmpty: computed(() => filteredTasks.value.length === 0 && filteredColumns.value.length === 0),
    isPending: computed(() => isTasksPending.value || isColumnsPending.value),
  }
}
