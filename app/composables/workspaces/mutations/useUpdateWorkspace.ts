import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'
import { saveWorkspace } from '~/services/workspace'
import type { IBoard } from '~/interfaces/domain/IBoard'

interface UpdateWorkspaceVars {
  payload: ISingleUpdate<IWorkspace>
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'update'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: ({ payload }: UpdateWorkspaceVars) =>
      requestQueueService.enqueue(payload.id, () => saveWorkspace(payload)),

    onMutate: async (vars) => {
      const queryWorkspacesKey = workspaceKeys.lists()
      const queryWorkspaceKey = workspaceKeys.detailed(vars.payload.id)

      await queryClient.cancelQueries({ queryKey: queryWorkspacesKey })
      await queryClient.cancelQueries({ queryKey: queryWorkspaceKey })

      const previousWorkspaces = queryClient.getQueryData<IWorkspace[]>(queryWorkspacesKey)
      const previousWorkspace = queryClient.getQueryData<IWorkspace>(queryWorkspaceKey)

      if (previousWorkspaces) {
        queryClient.setQueryData<IWorkspace[]>(queryWorkspacesKey, (old) => {
          if (!old) return []
          return old.map((w) => (w.id === vars.payload.id ? { ...w, ...vars.payload } : w))
        })
      }

      if (previousWorkspace) {
        queryClient.setQueryData<IWorkspace | null>(queryWorkspaceKey, (old) => {
          if (!old) return null
          return { ...old, ...vars.payload }
        })
      }

      return { previousWorkspaces, previousWorkspace, queryWorkspacesKey, queryWorkspaceKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousWorkspaces) {
        const originalWorkspace = context.previousWorkspaces.find((w) => w.id === vars.payload.id)

        if (originalWorkspace) {
          queryClient.setQueryData<IWorkspace[]>(context.queryWorkspacesKey, (current) => {
            return current?.map((w) => (w.id === vars.payload.id ? originalWorkspace : w)) ?? []
          })
        }
      }

      if (context?.previousWorkspace) {
        queryClient.setQueryData<IWorkspace>(context.queryWorkspaceKey, context.previousWorkspace)
      }
    },

    onSuccess: (result) => {
      const newWorkspaceId = result.data[0]!.id ?? null
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detailed(newWorkspaceId) })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.archived() })

      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newWorkspaceId) })

      const availableBoards = queryClient.getQueryData<IBoard[]>(
        boardKeys.byWorkspace(newWorkspaceId),
      )

      if (availableBoards && availableBoards.length > 0) {
        availableBoards.forEach((board) => {
          queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
        })
      }
    },
  })
}
