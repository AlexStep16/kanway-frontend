import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { removeBoard } from '~/services/board'

interface DeleteBoardVars {
  board: IBoard
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'delete'],
    meta: {
      keysToInvalidate: [boardKeys.archived()],
    },
    mutationFn: ({ board }: DeleteBoardVars) =>
      requestQueueService.enqueue(board.id, () => removeBoard(board.id)),

    onMutate: async ({ board }) => {
      const boardKey = boardKeys.byWorkspace(board.workspace.id)

      await queryClient.cancelQueries({ queryKey: boardKey })

      const previousBoards = queryClient.getQueryData<IBoard[]>(boardKey)

      if (previousBoards) {
        queryClient.setQueryData<IBoard[]>(boardKey, (oldBoards) =>
          oldBoards ? oldBoards.filter((b) => b.id !== board.id) : [],
        )
      }

      return { previousBoards, boardKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousBoards) {
        const boardToRestore = context.previousBoards.find((c) => c.id === vars.board.id)

        if (boardToRestore) {
          queryClient.setQueryData<IBoard[]>(context.boardKey, (current) => {
            if (current?.some((c) => c.id === vars.board.id)) return current

            return [boardToRestore, ...(current || [])]
          })
        }
      }
    },

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...boardKeys.count(), variables.board.workspace.id],
      })

      await queryClient.invalidateQueries({
        queryKey: boardKeys.byWorkspace(variables.board.workspace.id),
      })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(variables.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(variables.board.id) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(variables.board.id) })

      toast.success('Доска успешно удалена')
    },
  })
}
