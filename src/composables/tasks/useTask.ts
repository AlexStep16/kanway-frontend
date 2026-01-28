import { computed, MaybeRef, toValue } from 'vue'
import { useTasks } from './queries/useTasks'

export function useTask(id: MaybeRef<string | null>, boardId: MaybeRef<string | null>) {
  const { data: allTasks } = useTasks(boardId)

  return computed(() => {
    return allTasks.value?.find((t) => t.id === toValue(id)) || null
  })
}
