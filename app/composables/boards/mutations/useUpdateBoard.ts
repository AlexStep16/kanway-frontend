import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { saveBoard } from '~/services/board'
import type { IBoardEditApiPayload } from '~/interfaces/IBoardEditApiPayload'

interface UpdateBoardVars {
  payload: IBoardEditApiPayload
  workspaceId: string | null
}

export function useUpdateBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateBoardVars) =>
      requestQueueService.enqueue(payload.id, () => saveBoard(payload)),

    onMutate: async (vars) => {
      const queryBoardKey = vars.workspaceId
        ? boardKeys.byWorkspace(vars.workspaceId)
        : boardKeys.all
      const queryBoardDetailKey = boardKeys.detailed(vars.payload.id)

      await queryClient.cancelQueries({ queryKey: queryBoardKey })
      await queryClient.cancelQueries({ queryKey: queryBoardDetailKey })

      const previousBoards = queryClient.getQueryData<IBoard[]>(queryBoardKey)
      const previousBoard = queryClient.getQueryData<IBoard>(queryBoardDetailKey)

      if (previousBoards) {
        queryClient.setQueryData<IBoard[]>(queryBoardKey, (old) => {
          if (!old) return []
          return old.map((b) => (b.id === vars.payload.id ? { ...b, ...vars.payload } : b))
        })
      }

      if (previousBoard) {
        queryClient.setQueryData<IBoard | null>(queryBoardDetailKey, (old) => {
          if (!old) return null
          return { ...old, ...vars.payload }
        })
      }

      return { previousBoards, previousBoard, queryBoardKey, queryBoardDetailKey }
    },

    onSettled: (result, error, variables) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.archived() })
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(variables.workspaceId) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(variables.payload.id) })
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(variables.payload.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(variables.payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousBoards) {
        const originalBoard = context.previousBoards.find((b) => b.id === vars.payload.id)

        if (originalBoard) {
          queryClient.setQueryData<IBoard[]>(context.queryBoardKey, (current) => {
            return current?.map((b) => (b.id === vars.payload.id ? originalBoard : b)) ?? []
          })
        }
      }

      if (context?.previousBoard) {
        queryClient.setQueryData<IBoard>(context.queryBoardDetailKey, context.previousBoard)
      }
    },
  })
}
