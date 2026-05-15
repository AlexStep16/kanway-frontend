import { fetchArchivedTasks } from '~/services/task'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef } from 'vue'

export function useArchivedTasks(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: taskKeys.archived(),
    queryFn: () => fetchArchivedTasks(),
    placeholderData: (prev) => prev,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  })
}
