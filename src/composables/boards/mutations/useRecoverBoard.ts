import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IBoard } from '@/interfaces/domain/IBoard'
import { recoverBoard } from '@/services/board'
import { useUndo } from '@/composables/useUndo'

interface RecoverBoardVars {
  board: IBoard
}

export function useRecoverBoard() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'recover'],
    mutationFn: ({ board }: RecoverBoardVars) =>
      requestQueueService.enqueue(board.id, () => recoverBoard(board.id)),

    onMutate: async ({ board }) => {
      const actualBoardsKey = boardKeys.byWorkspace(board.workspace.id)
      const archivedBoardsKey = boardKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualBoardsKey })
      await queryClient.cancelQueries({ queryKey: archivedBoardsKey })

      const prevArchived = queryClient.getQueryData<IBoard[]>(archivedBoardsKey)
      const prevBoard = queryClient.getQueryData<IBoard[]>(actualBoardsKey)

      if (prevArchived) {
        queryClient.setQueryData<IBoard[]>(archivedBoardsKey, (old) =>
          old ? old.filter((b) => b.id !== board.id) : [],
        )
      }

      if (prevBoard) {
        queryClient.setQueryData<IBoard[]>(actualBoardsKey, (old) => {
          if (!old) return []

          return [...old, { ...board, isDeleted: false }]
        })
      }

      return { prevArchived, prevBoard, archivedBoardsKey, actualBoardsKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(context.archivedBoardsKey, context.prevArchived)
      }
      if (context?.prevBoard) {
        queryClient.setQueryData(context.actualBoardsKey, context.prevBoard)
      }
    },

    onSuccess: (result) => {
      toast.success('Доска восстановлена', {
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
