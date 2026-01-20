import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { recoverWorkspace } from '@services/workspace'
import { useUndo } from '@/composables/useUndo'

interface RecoverWorkspaceVars {
  workspace: IWorkspace
}

export function useRecoverWorkspace() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'recover'],
    mutationFn: ({ workspace }: RecoverWorkspaceVars) =>
      requestQueueService.enqueue(workspace.id, () => recoverWorkspace(workspace.id)),

    onMutate: async ({ workspace }) => {
      const actualWorkspacesKey = workspaceKeys.lists()
      const archivedWorkspacesKey = workspaceKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualWorkspacesKey })
      await queryClient.cancelQueries({ queryKey: archivedWorkspacesKey })

      const prevArchived = queryClient.getQueryData<IWorkspace[]>(archivedWorkspacesKey)
      const prevWorkspace = queryClient.getQueryData<IWorkspace[]>(actualWorkspacesKey)

      if (prevArchived) {
        queryClient.setQueryData<IWorkspace[]>(archivedWorkspacesKey, (old) =>
          old ? old.filter((w) => w.id !== workspace.id) : [],
        )
      }

      if (prevWorkspace) {
        queryClient.setQueryData<IWorkspace[]>(actualWorkspacesKey, (old) => {
          if (!old) return []

          return [...old, { ...workspace, isDeleted: false }]
        })
      }

      return { prevArchived, prevWorkspace, archivedWorkspacesKey, actualWorkspacesKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(context.archivedWorkspacesKey, context.prevArchived)
      }
      if (context?.prevWorkspace) {
        queryClient.setQueryData(context.actualWorkspacesKey, context.prevWorkspace)
      }
    },

    onSuccess: (result) => {
      toast.success('Пространство восстановлено', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },
  })
}
