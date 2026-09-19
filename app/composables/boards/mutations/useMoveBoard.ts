import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { IBoard } from '~/interfaces/domain/IBoard'
import type { IBoardEditApiPayload } from '~/interfaces/IBoardEditApiPayload'
import { saveBoard } from '~/services/board'

interface MoveBoardVars {
  payload: IBoardEditApiPayload
  oldWorkspaceId: string
  newWorkspaceId: string
}

function getOrderedBoards(boards: IBoard[]): IBoard[] {
  const { favoriteBoards, otherBoards } = boards.reduce(
    (acc, board) => {
      if (board.isFavorite) {
        acc.favoriteBoards.push(board)
      } else {
        acc.otherBoards.push(board)
      }
      return acc
    },
    {
      favoriteBoards: [] as (typeof boards)[number][],
      otherBoards: [] as (typeof boards)[number][],
    },
  )

  favoriteBoards.sort((a, b) => a.rank.localeCompare(b.rank))
  otherBoards.sort((a, b) => a.rank.localeCompare(b.rank))
  return [...favoriteBoards, ...otherBoards]
}

export function useMoveBoard() {
  const queryClient = useQueryClient()
  const boardStore = useBoardStore()
  const uiStore = useUIStore()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'move'],
    mutationFn: ({ payload }: MoveBoardVars) =>
      requestQueueService.enqueue(payload.id, () => saveBoard(payload)),

    onSuccess: async (result, { oldWorkspaceId, newWorkspaceId, payload }) => {
      await queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(oldWorkspaceId) })

      const boards = queryClient.getQueryData<IBoard[]>(boardKeys.byWorkspace(oldWorkspaceId))

      const nextBoard = getOrderedBoards(boards ?? [])[0]

      if (nextBoard) boardStore.selectBoard(nextBoard.id)
      else {
        boardStore.clearBoard()
        uiStore.selectChat()
      }

      toast.success('Доска успешно перемещена', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })

      queryClient.invalidateQueries({
        queryKey: [...boardKeys.count(), oldWorkspaceId],
      })
      queryClient.invalidateQueries({
        queryKey: [...boardKeys.count(), newWorkspaceId],
      })
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newWorkspaceId) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(payload.id) })

      // Invalidate related columns and tasks to update their workspace references
      queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(payload.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(payload.id) })
    },
  })
}
