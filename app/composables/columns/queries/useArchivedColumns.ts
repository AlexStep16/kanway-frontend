import { fetchArchivedColumns } from '~/services/column'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef } from 'vue'

export function useArchivedColumns(isEnabled: MaybeRef<boolean> = true) {
  return useQuery({
    queryKey: columnKeys.archived(),
    queryFn: () => fetchArchivedColumns(),
    placeholderData: (prev) => prev,
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
  })
}
