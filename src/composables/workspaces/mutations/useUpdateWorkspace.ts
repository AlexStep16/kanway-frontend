import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { saveWorkspace } from '@/services/workspace'

interface UpdateWorkspaceVars {
  payload: ISingleUpdate<IWorkspace>
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateWorkspaceVars) =>
      requestQueueService.enqueue(payload.id, () => saveWorkspace(payload)),

    onMutate: async (vars) => {
      const queryKey = workspaceKeys.lists()

      await queryClient.cancelQueries({ queryKey })

      const previousWorkspaces = queryClient.getQueryData<IWorkspace[]>(queryKey)

      if (previousWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      return { previousWorkspaces, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(context.queryKey, context.previousWorkspaces)
      }
    },
  })
}
