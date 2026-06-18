import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRef } from 'vue'
import type WorkspaceModel from '~/models/WorkspaceModel'
import { fetchWorkspace } from '~/services/workspace'

export function useWorkspace(id: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: computed(() => workspaceKeys.detailed(id)),
    queryFn: () => {
      const idVal = toValue(id)
      if (!idVal) {
        throw new Error('id is required to fetch workspace')
      }
      return fetchWorkspace(idVal)
    },
    enabled: computed(() => !!toValue(id)),

    initialData: () => {
      return queryClient
        .getQueryData<WorkspaceModel[]>(workspaceKeys.lists())
        ?.find((w) => w.id === toValue(id))
    },

    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(workspaceKeys.lists())?.dataUpdatedAt
    },
  })
}
