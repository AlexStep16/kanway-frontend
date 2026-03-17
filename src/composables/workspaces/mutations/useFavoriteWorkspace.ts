import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { saveWorkspace } from '@/services/workspace'
import { useUndo } from '@/composables/logs/useUndo'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'

export function useFavoriteWorkspace() {
  const { mutate: undo } = useUndo()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'favorite'],
    mutationFn: ({ workspace }: { workspace: IWorkspace }) =>
      requestQueueService.enqueue(workspace.id, () =>
        saveWorkspace({ id: workspace.id, isFavorite: !workspace.isFavorite }),
      ),

    onMutate: async ({ workspace }: { workspace: IWorkspace }) => {
      const queryKey = workspaceKeys.lists()

      const previousWorkspaces = queryClient.getQueryData<IWorkspace[]>(queryKey)

      if (previousWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === workspace.id ? { ...t, isFavorite: !t.isFavorite } : t))
        })
      }

      return { previousWorkspaces, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousWorkspaces) {
        const originalWorkspace = context.previousWorkspaces.find((b) => b.id === vars.workspace.id)

        if (originalWorkspace) {
          queryClient.setQueryData<IWorkspace[]>(context.queryKey, (current) => {
            return current?.map((b) => (b.id === vars.workspace.id ? originalWorkspace : b)) ?? []
          })
        }
      }
    },
  })
}
