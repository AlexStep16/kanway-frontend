import { useQuery } from '@tanstack/vue-query'
import { computed, MaybeRef, toValue } from 'vue'
import { boardKeys } from '@/keys'
import { fetchBoard } from '@services/board'
import { IBoard } from '@/interfaces/domain/IBoard'
import { queryClient } from '@/plugins/queryClient'

export function useBoard(id: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: boardKeys.detailed(id),
    queryFn: () => fetchBoard(toValue(id)!),
    enabled: computed(() => !!toValue(id) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    initialData: () => {
      return queryClient.getQueryData<IBoard[]>(boardKeys.all)?.find((b) => b.id === toValue(id))
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(boardKeys.all)?.dataUpdatedAt,
    staleTime: 1000 * 60 * 5,
  })
}
