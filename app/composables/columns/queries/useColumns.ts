import { useQuery } from '@tanstack/vue-query'
import { fetchColumns } from '~/services/column'

export function useColumns(boardId: MaybeRef<string | null>, isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: columnKeys.byBoard(boardId),
    queryFn: () => fetchColumns(toValue(boardId)!),
    enabled: computed(() => !!toValue(boardId) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
