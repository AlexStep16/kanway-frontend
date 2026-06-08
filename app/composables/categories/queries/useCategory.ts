import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchColumn } from '~/services/column'

export function useColumn(id: MaybeRef<string>, boardId?: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: columnKeys.detailed(id),
    queryFn: () => fetchColumn(toValue(id)),
    enabled: !!toValue(id),

    initialData: () => {
      if (!boardId) return undefined

      return useColumnSelector(id, boardId).value ?? undefined
    },

    initialDataUpdatedAt: () => {
      return boardId
        ? queryClient.getQueryState(columnKeys.byBoard(boardId))?.dataUpdatedAt
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
