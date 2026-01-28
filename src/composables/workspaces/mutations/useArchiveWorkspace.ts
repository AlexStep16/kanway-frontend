import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, taskKeys, categoryKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@/interfaces/domain/IWorkspace'
import { archiveWorkspace } from '@/services/workspace'
import { useUndo } from '@/composables/useUndo'
import { IBoard } from '@/interfaces/domain/IBoard'

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
      const queryKey = workspaceKeys.lists()

      await queryClient.cancelQueries({ queryKey })

      const previousWorkspaces = queryClient.getQueryData<IWorkspace[]>(queryKey)

      if (previousWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(queryKey, (old) =>
          old ? old.filter((c) => c.id !== workspace.id) : [],
        )
      }

      return { previousWorkspaces, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(context.queryKey, context.previousWorkspaces)
      }
    },

    onSuccess: (result) => {
      const workspaceId = result.data[0].id ?? null
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(workspaceId) })

      const availableBoards = queryClient.getQueryData<IBoard[]>(boardKeys.byWorkspace(workspaceId))

      if (availableBoards && availableBoards.length > 0) {
        availableBoards.forEach((board) => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
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
    },
  })
}
