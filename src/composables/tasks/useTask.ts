import { computed, MaybeRef, toValue } from 'vue'
import { useTasks } from './queries/useTasks'
import { useArchivedTasks } from './queries/useArchivedTasks'

export function useTask(
  id: MaybeRef<string | null>,
  boardId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: tasksData } = useTasks(boardId, isEnabled)
  const { data: archivedTasksData } = useArchivedTasks(isEnabled)

  const allTasks = computed(() => {
    const tasks = tasksData.value || []
    const archivedTasks = archivedTasksData.value || []

    return [...tasks, ...archivedTasks]
  })

  return computed(() => {
    return allTasks.value?.find((t) => t.id === toValue(id)) || null
  })
}
