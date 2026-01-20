import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { taskKeys } from '@/keys'
import { fetchTask } from '@services/task'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { queryClient } from '@/plugins/queryClient'

export function useTask(id: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: taskKeys.detailed(id),
    queryFn: () => fetchTask(toValue(id)!),
    enabled: computed(() => !!toValue(id) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    initialData: () => {
      return queryClient.getQueryData<ITaskState[]>(taskKeys.all)?.find((t) => t.id === toValue(id))
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(taskKeys.all)?.dataUpdatedAt,
    staleTime: 1000 * 60 * 5,
  })
}
