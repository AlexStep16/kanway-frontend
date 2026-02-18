import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys' // Твои ключи кэша
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { removeWorkspace } from '@services/workspace'
import { useWorkspaceStore } from '@/stores/workspace'
import { IBoard } from '@/interfaces/domain/IBoard'

interface DeleteWorkspaceVars {
  workspace: IWorkspace
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'delete'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists(), workspaceKeys.archived()],
    },
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
        const workspaceToRestore = context.previousWorkspaces.find(
          (w) => w.id === vars.workspace.id,
        )

        if (workspaceToRestore) {
          queryClient.setQueryData<IWorkspace[]>(context.workspaceKey, (current) => {
            if (current?.some((w) => w.id === vars.workspace.id)) return current

            return [workspaceToRestore, ...(current || [])]
          })
        }
      }
    },

    onSuccess: (data, variables) => {
      const WORKSPACE_STORE = useWorkspaceStore()

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(variables.workspace.id) })

      const availableBoards = queryClient.getQueryData<IBoard[]>(
        boardKeys.byWorkspace(variables.workspace.id),
      )

      if (availableBoards && availableBoards.length > 0) {
        availableBoards.forEach((board) => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
        })
      }

      if (WORKSPACE_STORE.activeWorkspaceId === variables.workspace.id) {
        const workspaces = queryClient.getQueryData<IWorkspace[]>(workspaceKeys.lists())

        const nextWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null

        if (nextWorkspace) WORKSPACE_STORE.selectWorkspace(nextWorkspace, true)
      }

      toast.success('Пространство успешно удалено')
    },
  })
}
