import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRef } from 'vue'
import { fetchWorkspace } from '~/services/workspace'

export function useWorkspace(id: MaybeRef<string>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: workspaceKeys.detailed(id),
    queryFn: () => fetchWorkspace(toValue(id)),
    enabled: !!toValue(id),

    initialData: () => {
      return useWorkspaceSelector(id).value ?? undefined
    },

    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(workspaceKeys.lists())?.dataUpdatedAt
    },
  })
}
