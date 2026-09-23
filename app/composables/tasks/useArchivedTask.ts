export function useArchivedTask(id: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  const { data: archivedTasksData } = useArchivedTasks(isEnabled)

  return computed(() => {
    return archivedTasksData.value?.find((t) => t.id === toValue(id)) || null
  })
}
