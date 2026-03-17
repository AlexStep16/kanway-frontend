import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRef } from 'vue'
import { workspaceKeys } from '@/keys'
import { fetchWorkspace } from '@services/workspace'
import { useWorkspace as useWorkspaceFunction } from '../useWorkspace'

export function useWorkspace(id: MaybeRef<string>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: workspaceKeys.detailed(id),
    queryFn: () => fetchWorkspace(toValue(id)),
    enabled: !!toValue(id),

    initialData: () => {
      return useWorkspaceFunction(id).value ?? undefined
    },

    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(workspaceKeys.lists())?.dataUpdatedAt
    },
  })
}
