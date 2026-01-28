import { computed, MaybeRef, toValue } from 'vue'
import { useChats } from './useChats'

export function useChat(id: MaybeRef<string | null>, workspaceId: MaybeRef<string | null>) {
  const { data: allChats } = useChats(workspaceId)

  return computed(() => {
    return allChats.value?.find((c) => c.id === toValue(id)) || null
  })
}
