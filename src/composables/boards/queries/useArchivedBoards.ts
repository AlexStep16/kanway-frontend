import { boardKeys } from '@/keys'
import { fetchArchivedBoards } from '@services/board'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef } from 'vue'

export function useArchivedBoards(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: boardKeys.archived(),
    queryFn: () => fetchArchivedBoards(),
    placeholderData: (prev) => prev,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  })
}
