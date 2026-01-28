import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef } from 'vue'
import { workspaceKeys } from '@/keys'
import { fetchWorkspaces } from '@services/workspace'

export function useWorkspaces(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => fetchWorkspaces(),
    enabled: isEnabled,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
