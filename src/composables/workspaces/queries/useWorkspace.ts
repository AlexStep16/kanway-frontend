import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { workspaceKeys } from '@/keys'
import { fetchWorkspace } from '@/services/workspace'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { queryClient } from '@/plugins/queryClient'

export function useWorkspace(id: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: workspaceKeys.detailed(id),
    queryFn: () => fetchWorkspace(toValue(id)!),
    enabled: computed(() => !!toValue(id) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    initialData: () => {
      return queryClient
        .getQueryData<IWorkspace[]>(workspaceKeys.all)
        ?.find((b) => b.id === toValue(id))
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(workspaceKeys.all)?.dataUpdatedAt,
    staleTime: 1000 * 60 * 5,
  })
}
