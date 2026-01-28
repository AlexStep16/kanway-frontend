import { boardKeys } from '@/keys'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useBoard as useBoardFunction } from '../useBoard'
import { MaybeRef, toValue } from 'vue'
import { fetchBoard } from '@/services/board'

export function useBoard(id: MaybeRef<string>, workspaceId?: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: boardKeys.detailed(id),
    queryFn: () => fetchBoard(toValue(id)),
    enabled: !!toValue(id),

    initialData: () => {
      if (!workspaceId) return undefined

      return useBoardFunction(id, workspaceId).value ?? undefined
    },

    initialDataUpdatedAt: () => {
      return workspaceId
        ? queryClient.getQueryState(boardKeys.byWorkspace(workspaceId))?.dataUpdatedAt
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
