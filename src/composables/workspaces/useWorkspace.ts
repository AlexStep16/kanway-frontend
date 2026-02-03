import { computed, MaybeRef, toValue } from 'vue'
import { useWorkspaces } from './queries/useWorkspaces'

export function useWorkspace(id: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  const { data: workspaceData } = useWorkspaces(isEnabled)

  return computed(() => {
    return workspaceData.value?.find((w) => w.id === toValue(id)) || null
  })
}
