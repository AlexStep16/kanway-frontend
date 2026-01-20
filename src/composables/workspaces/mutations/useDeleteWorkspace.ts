import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { workspaceKeys } from '@/keys' // Твои ключи кэша
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { removeWorkspace } from '@services/workspace'
import { useWorkspaceStore } from '@/stores/workspace'

interface DeleteWorkspaceVars {
  workspace: IWorkspace
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'delete'],
    mutationFn: ({ workspace }: DeleteWorkspaceVars) =>
      requestQueueService.enqueue(workspace.id, () => removeWorkspace(workspace.id)),

    onMutate: async ({ workspace }) => {
      const workspaceKey = workspaceKeys.lists()

      await queryClient.cancelQueries({ queryKey: workspaceKey })

      const previousWorkspaces = queryClient.getQueryData<IWorkspace[]>(workspaceKey)

      if (previousWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(workspaceKey, (oldWorkspaces) =>
          oldWorkspaces ? oldWorkspaces.filter((w) => w.id !== workspace.id) : [],
        )
      }

      return { previousWorkspaces, workspaceKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(context.workspaceKey, context.previousWorkspaces)
      }
    },

    onSuccess: (data, variables) => {
      const WORKSPACE_STORE = useWorkspaceStore()

      if (WORKSPACE_STORE.activeWorkspaceId === variables.workspace.id) {
        const workspaces = queryClient.getQueryData<IWorkspace[]>(workspaceKeys.lists())

        const nextWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null

        if (nextWorkspace) WORKSPACE_STORE.selectWorkspace(nextWorkspace, true)
      }

      toast.success('Пространство успешно удалено')
    },
  })
}
