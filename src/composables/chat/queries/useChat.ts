import { IChat } from '@/interfaces/domain/IChat'
import { chatKeys } from '@/keys'
import { fetchChat } from '@/services/chat'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'

export function useChat(id: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: chatKeys.detailed(id),
    queryFn: () => fetchChat(toValue(id)!),
    enabled: computed(() => !!toValue(id)),
    placeholderData: (prev) => prev,
    initialData: () => {
      return queryClient.getQueryData<IChat[]>(chatKeys.all)?.find((t) => t.id === toValue(id))
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(chatKeys.all)?.dataUpdatedAt,
    staleTime: 1000 * 60 * 5,
  })
}
