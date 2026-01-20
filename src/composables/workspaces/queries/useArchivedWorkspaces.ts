import { workspaceKeys } from '@/keys'
import { fetchArchivedWorkspaces } from '@services/workspace'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef } from 'vue'

export function useArchivedWorkspaces(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: workspaceKeys.archived(),
    queryFn: () => fetchArchivedWorkspaces(),
    placeholderData: (prev) => prev,
    initialData: () => [],
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  })
}
