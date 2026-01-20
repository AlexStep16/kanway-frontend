import { computed, MaybeRef } from 'vue'
import { useTasks } from './queries/useTasks'

export function useTaskTags(boardId: MaybeRef<string | null>) {
  const { data: tasks } = useTasks(boardId)

  const tags = computed(() => {
    const currentTasks = tasks.value

    if (!currentTasks || currentTasks.length === 0) return []

    const uniqueTags = new Set<string>()

    for (const task of currentTasks) {
      if (task.tags && task.tags.length > 0) {
        for (const tag of task.tags) {
          uniqueTags.add(tag)
        }
      }
    }

    return Array.from(uniqueTags)
  })

  return { tags }
}
