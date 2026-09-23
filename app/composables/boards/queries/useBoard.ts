import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { fetchBoard } from '~/services/board'

export function useBoard(id: MaybeRef<string | null>, workspaceId?: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: computed(() => boardKeys.detailed(id)),
    queryFn: () => {
      const idVal = toValue(id)
      if (!idVal) {
        throw new Error('id is required to fetch board')
      }

      return fetchBoard(idVal)
    },
    enabled: computed(() => !!toValue(id)),

    initialData: () => {
      if (!workspaceId) return undefined

      return queryClient
        .getQueryData<IBoard[]>(boardKeys.byWorkspace(toValue(workspaceId)))
        ?.find((b) => b.id === toValue(id))
    },

    initialDataUpdatedAt: () => {
      return workspaceId
        ? queryClient.getQueryState(boardKeys.byWorkspace(toValue(workspaceId)))?.dataUpdatedAt
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
