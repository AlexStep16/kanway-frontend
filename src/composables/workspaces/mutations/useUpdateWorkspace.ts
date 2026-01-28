import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { saveWorkspace } from '@/services/workspace'
import { IBoard } from '@/interfaces/domain/IBoard'

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

    onSuccess: (result) => {
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
    },

    onError: (err, vars, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(context.queryKey, context.previousWorkspaces)
      }
    },
  })
}
