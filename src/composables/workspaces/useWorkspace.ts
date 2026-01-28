import { computed, MaybeRef, toValue } from 'vue'
import { useWorkspaces } from './queries/useWorkspaces'

export function useWorkspace(id: MaybeRef<string | null>) {
  const { data: allWorkspaces } = useWorkspaces()

  return computed(() => {
    return allWorkspaces.value?.find((w) => w.id === toValue(id)) || null
  })
}
