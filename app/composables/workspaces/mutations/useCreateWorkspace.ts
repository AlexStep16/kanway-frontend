import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import { createWorkspace } from '~/services/workspace'
import { useWorkspaceStore } from '~/stores/workspace'

interface CreateWorkspaceVars {
  payload: Partial<IWorkspace>
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'create'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ payload }: CreateWorkspaceVars) => {
      if (!payload) {
        throw new Error('Недостаточно данных для создания пространства')
      }

      return createWorkspace(payload)
    },

    onSuccess: async (result) => {
      const workspaceStore = useWorkspaceStore()

      queryClient.setQueryData(workspaceKeys.lists(), (oldWorkspaces: IWorkspace[] | undefined) => {
        return oldWorkspaces ? [...oldWorkspaces, ...result.data] : result.data
      })

      if (result.data && result.data.length > 0) workspaceStore.selectWorkspace(result.data[0]!)
    },
  })
}
