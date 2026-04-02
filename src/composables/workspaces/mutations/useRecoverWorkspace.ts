import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { recoverWorkspace } from '@services/workspace'
import { useUndo } from '@/composables/logs/useUndo'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useWorkspaceStore } from '@/stores/workspace'

interface RecoverWorkspaceVars {
  workspace: IWorkspace
}

export function useRecoverWorkspace() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'recover'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists(), workspaceKeys.archived()],
    },
    mutationFn: ({ workspace }: RecoverWorkspaceVars) =>
      requestQueueService.enqueue(workspace.id, () => recoverWorkspace(workspace.id)),

    onMutate: async ({ workspace }) => {
      const actualWorkspacesKey = workspaceKeys.lists()
      const archivedWorkspacesKey = workspaceKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualWorkspacesKey })
      await queryClient.cancelQueries({ queryKey: archivedWorkspacesKey })

      const prevArchived = queryClient.getQueryData<IWorkspace[]>(archivedWorkspacesKey)
      const prevWorkspaces = queryClient.getQueryData<IWorkspace[]>(actualWorkspacesKey)

      if (prevArchived) {
        queryClient.setQueryData<IWorkspace[]>(archivedWorkspacesKey, (old) =>
          old ? old.filter((w) => w.id !== workspace.id) : [],
        )
      }

      if (prevWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(actualWorkspacesKey, (old) =>
          old ? [...old, { ...workspace, isDeleted: false }] : [{ ...workspace, isDeleted: false }],
        )
      }

      return { prevArchived, prevWorkspaces, archivedWorkspacesKey, actualWorkspacesKey }
    },

    onError: (err, vars, context) => {
      if (context?.actualWorkspacesKey) {
        queryClient.setQueryData<IWorkspace[]>(context.actualWorkspacesKey, (current) => {
          return current?.filter((w) => w.id !== vars.workspace.id) || []
        })
      }

      if (context?.prevArchived) {
        const workspaceToRestore = context.prevArchived.find((w) => w.id === vars.workspace.id)

        if (workspaceToRestore) {
          queryClient.setQueryData<IWorkspace[]>(context.archivedWorkspacesKey, (current) => {
            if (current?.some((w) => w.id === vars.workspace.id)) return current
            return [workspaceToRestore, ...(current || [])]
          })
        }
      }
    },

    onSuccess: (result) => {
      const workspaceStore = useWorkspaceStore()
      const newWorkspaceId = result.data[0].id ?? null

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newWorkspaceId) })

      const availableBoards = queryClient.getQueryData<IBoard[]>(
        boardKeys.byWorkspace(newWorkspaceId),
      )

      if (availableBoards && availableBoards.length > 0) {
        availableBoards.forEach((board) => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
        })
      }

      toast.success('Пространство восстановлено', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })

      const workspaces = queryClient.getQueryData<IWorkspace[]>(workspaceKeys.lists())
      const workspace = workspaces?.find((w) => w.id === result.data[0].id)

      if (workspace) {
        workspaceStore.selectWorkspace(workspace, true)
      }
    },
  })
}
