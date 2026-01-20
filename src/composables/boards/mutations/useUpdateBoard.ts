import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IBoard } from '@/interfaces/domain/IBoard'
import { saveBoard } from '@services/board'

interface UpdateBoardVars {
  payload: ISingleUpdate<IBoard>
  workspaceId?: string | null
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

    onError: (err, vars, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(context.queryKey, context.previousBoards)
      }
    },
  })
}
