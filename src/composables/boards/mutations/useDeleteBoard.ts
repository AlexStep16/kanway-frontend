import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys } from '@/keys' // Твои ключи кэша
import { requestQueueService } from '@/utils/RequestQueueService'
import { IBoard } from '@/interfaces/domain/IBoard'
import { removeBoard } from '@/services/board'
import { useBoardStore } from '@stores/board'

interface DeleteBoardVars {
  board: IBoard
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'delete'],
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
        queryClient.setQueryData(context.boardKey, context.previousBoards)
      }
    },

    onSuccess: (data, variables) => {
      const BOARD_STORE = useBoardStore()

      if (BOARD_STORE.activeBoardId === variables.board.id) {
        const boards = queryClient.getQueryData<IBoard[]>(
          boardKeys.byWorkspace(variables.board.workspace.id),
        )
        const nextBoard = boards && boards.length > 0 ? boards[0] : null

        if (nextBoard) BOARD_STORE.selectBoard(nextBoard, true)
      }

      toast.success('Доска успешно удалена')
    },
  })
}
