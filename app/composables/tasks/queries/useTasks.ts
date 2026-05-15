import { useQuery } from '@tanstack/vue-query'
import { fetchTasks } from '~/services/task'

export function useTasks(boardId: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: taskKeys.byBoard(boardId),
    queryFn: () => fetchTasks(toValue(boardId)!),
    enabled: computed(() => !!toValue(boardId) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
