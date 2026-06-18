import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { requestQueueService } from '~/utils/RequestQueueService'
import type { IBoard } from '~/interfaces/domain/IBoard'
import { archiveBoard } from '~/services/board'
import { useBoardStore } from '~/stores/board'

interface ArchiveBoardVars {
  board: IBoard
}

export function useArchiveBoard() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'archive'],
    meta: {
      keysToInvalidate: [boardKeys.archived()],
    },
    mutationFn: ({ board }: ArchiveBoardVars) =>
      requestQueueService.enqueue(board.id, () => archiveBoard(board.id)),

    onMutate: async ({ board }) => {
      const actualBoardsKey = boardKeys.byWorkspace(board.workspace.id)
      const archivedBoardsKey = boardKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualBoardsKey })
      await queryClient.cancelQueries({ queryKey: archivedBoardsKey })

      const prevBoards = queryClient.getQueryData<IBoard[]>(actualBoardsKey)
      const prevArchived = queryClient.getQueryData<IBoard[]>(archivedBoardsKey)

      if (prevBoards) {
        queryClient.setQueryData<IBoard[]>(actualBoardsKey, (old) =>
          old ? old.filter((b) => b.id !== board.id) : [],
        )
      }

      if (prevArchived) {
        queryClient.setQueryData<IBoard[]>(archivedBoardsKey, (old) =>
          old ? [...old, { ...board, isDeleted: true }] : [{ ...board, isDeleted: true }],
        )
      }

      return { prevArchived, prevBoards, archivedBoardsKey, actualBoardsKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevBoards) {
        const boardToRestore = context.prevBoards.find((b) => b.id === vars.board.id)

        if (boardToRestore) {
          queryClient.setQueryData<IBoard[]>(context.actualBoardsKey, (current) => {
            if (current?.some((b) => b.id === vars.board.id)) return current
            return [boardToRestore, ...(current || [])]
          })
        }
      }

      if (context?.archivedBoardsKey) {
        queryClient.setQueryData<IBoard[]>(context.archivedBoardsKey, (current) => {
          return current?.filter((b) => b.id !== vars.board.id) || []
        })
      }
    },

    onSuccess: (result) => {
      const boardStore = useBoardStore()

      toast.success('Доска архивирована', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })

      if (boardStore.activeBoardId === result.data[0]!.id) {
        const boards = queryClient.getQueryData<IBoard[]>(
          boardKeys.byWorkspace(result.data[0]!.workspace.id),
        )

        const nextBoard = boards?.length ? boards[0] : null

        if (nextBoard) boardStore.selectBoard(nextBoard.id)
        else boardStore.navigateToChat()
      }
    },

    onSettled: (data, error, { board }) => {
      queryClient.invalidateQueries({
        queryKey: [...boardKeys.count(), board.workspace.id],
      })
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(board.id) })
    },
  })
}
