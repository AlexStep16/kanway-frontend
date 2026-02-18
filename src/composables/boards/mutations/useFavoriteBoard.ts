import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { saveBoard } from '@/services/board'
import { IBoard } from '@/interfaces/domain/IBoard'

export function useFavoriteBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'favorite'],
    mutationFn: ({ board }: { board: IBoard }) =>
      requestQueueService.enqueue(board.id, () =>
        saveBoard({ id: board.id, isFavorite: !board.isFavorite }),
      ),

    onMutate: async ({ board }: { board: IBoard }) => {
      const queryKey = boardKeys.byWorkspace(board.workspace.id)

      const previousBoards = queryClient.getQueryData<IBoard[]>(queryKey)

      if (previousBoards) {
        queryClient.setQueryData<IBoard[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === board.id ? { ...t, isFavorite: !t.isFavorite } : t))
        })
      }

      return { previousBoards, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousBoards) {
        const originalBoard = context.previousBoards.find((b) => b.id === vars.board.id)

        if (originalBoard) {
          queryClient.setQueryData<IBoard[]>(context.queryKey, (current) => {
            return current?.map((b) => (b.id === vars.board.id ? originalBoard : b)) ?? []
          })
        }
      }
    },
  })
}
