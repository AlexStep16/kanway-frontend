import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import { archiveWorkspace } from '~/services/workspace'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { useWorkspaceStore } from '~/stores/workspace'

interface ArchiveWorkspaceVars {
  workspace: IWorkspace
}

export function useArchiveWorkspace() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'archive'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists(), workspaceKeys.archived()],
    },
    mutationFn: ({ workspace }: ArchiveWorkspaceVars) =>
      requestQueueService.enqueue(workspace.id, () => archiveWorkspace(workspace.id)),

    onMutate: async ({ workspace }) => {
      const actualWorkspacesKey = workspaceKeys.lists()
      const archivedWorkspacesKey = workspaceKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualWorkspacesKey })
      await queryClient.cancelQueries({ queryKey: archivedWorkspacesKey })

      const prevWorkspaces = queryClient.getQueryData<IWorkspace[]>(actualWorkspacesKey)
      const prevArchived = queryClient.getQueryData<IWorkspace[]>(archivedWorkspacesKey)

      if (prevWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(actualWorkspacesKey, (old) =>
          old ? old.filter((w) => w.id !== workspace.id) : [],
        )
      }

      if (prevArchived) {
        queryClient.setQueryData<IWorkspace[]>(archivedWorkspacesKey, (old) =>
          old ? [...old, { ...workspace, isDeleted: true }] : [{ ...workspace, isDeleted: true }],
        )
      }

      return { prevArchived, prevWorkspaces, archivedWorkspacesKey, actualWorkspacesKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevWorkspaces) {
        const workspaceToRestore = context.prevWorkspaces.find((w) => w.id === vars.workspace.id)

        if (workspaceToRestore) {
          queryClient.setQueryData<IWorkspace[]>(context.actualWorkspacesKey, (current) => {
            if (current?.some((w) => w.id === vars.workspace.id)) return current
            return [workspaceToRestore, ...(current || [])]
          })
        }
      }

      if (context?.archivedWorkspacesKey) {
        queryClient.setQueryData<IWorkspace[]>(context.archivedWorkspacesKey, (current) => {
          return current?.filter((w) => w.id !== vars.workspace.id) || []
        })
      }
    },

    onSuccess: (result) => {
      const workspaceStore = useWorkspaceStore()
      const workspaceId = result.data[0]!.id ?? null

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(workspaceId) })

      const availableBoards = queryClient.getQueryData<IBoard[]>(boardKeys.byWorkspace(workspaceId))

      if (availableBoards && availableBoards.length > 0) {
        availableBoards.forEach((board) => {
          queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
        })
      }

      toast.success('Пространство архивировано', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })

      if (workspaceStore.activeWorkspaceId === result.data[0]!.id) {
        const workspaces = queryClient.getQueryData<IWorkspace[]>(workspaceKeys.lists())

        const nextWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null

        if (nextWorkspace) workspaceStore.selectWorkspace(nextWorkspace, true)
      }
    },
  })
}
