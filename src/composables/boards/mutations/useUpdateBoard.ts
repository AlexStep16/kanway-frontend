import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IBoard } from '@/interfaces/domain/IBoard'
import { saveBoard } from '@services/board'

interface UpdateBoardVars {
  payload: ISingleUpdate<IBoard>
  workspaceId: string | null
}

export function useUpdateBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateBoardVars) =>
      requestQueueService.enqueue(payload.id, () => saveBoard(payload)),

    onMutate: async (vars) => {
      const queryKey = vars.workspaceId ? boardKeys.byWorkspace(vars.workspaceId) : boardKeys.all

      await queryClient.cancelQueries({ queryKey })

      const previousBoards = queryClient.getQueryData<IBoard[]>(queryKey)

      if (previousBoards) {
        queryClient.setQueryData<IBoard[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      return { previousBoards, queryKey }
    },

    onSettled: (result, error, variables) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(variables.payload.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(variables.payload.id) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(variables.payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousBoards) {
        const originalBoard = context.previousBoards.find((b) => b.id === vars.payload.id)

        if (originalBoard) {
          queryClient.setQueryData<IBoard[]>(context.queryKey, (current) => {
            return current?.map((b) => (b.id === vars.payload.id ? originalBoard : b)) ?? []
          })
        }
      }
    },
  })
}
