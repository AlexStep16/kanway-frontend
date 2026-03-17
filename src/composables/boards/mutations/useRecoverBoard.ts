import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IBoard } from '@/interfaces/domain/IBoard'
import { recoverBoard } from '@/services/board'
import { useUndo } from '@/composables/logs/useUndo'

interface RecoverBoardVars {
  board: IBoard
}

export function useRecoverBoard() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'recover'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists(), boardKeys.archived()],
    },
    mutationFn: ({ board }: RecoverBoardVars) =>
      requestQueueService.enqueue(board.id, () => recoverBoard(board.id)),

    onMutate: async ({ board }) => {
      const actualBoardsKey = boardKeys.byWorkspace(board.workspace.id)
      const archivedBoardsKey = boardKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualBoardsKey })
      await queryClient.cancelQueries({ queryKey: archivedBoardsKey })

      const prevArchived = queryClient.getQueryData<IBoard[]>(archivedBoardsKey)
      const prevBoards = queryClient.getQueryData<IBoard[]>(actualBoardsKey)

      if (prevArchived) {
        queryClient.setQueryData<IBoard[]>(archivedBoardsKey, (old) =>
          old ? old.filter((b) => b.id !== board.id) : [],
        )
      }

      if (prevBoards) {
        queryClient.setQueryData<IBoard[]>(actualBoardsKey, (old) =>
          old ? [...old, { ...board, isDeleted: false }] : [{ ...board, isDeleted: false }],
        )
      }

      return { prevArchived, prevBoards, archivedBoardsKey, actualBoardsKey }
    },

    onError: (err, vars, context) => {
      if (context?.actualBoardsKey) {
        queryClient.setQueryData<IBoard[]>(context.actualBoardsKey, (current) => {
          return current?.filter((b) => b.id !== vars.board.id) || []
        })
      }

      if (context?.prevArchived) {
        const boardToRestore = context.prevArchived.find((b) => b.id === vars.board.id)
        if (boardToRestore) {
          queryClient.setQueryData<IBoard[]>(context.archivedBoardsKey, (current) => {
            if (current?.some((b) => b.id === vars.board.id)) return current
            return [boardToRestore, ...(current || [])]
          })
        }
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

    onSettled: (result, error, { board }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(board.id) })

      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
    },
  })
}
