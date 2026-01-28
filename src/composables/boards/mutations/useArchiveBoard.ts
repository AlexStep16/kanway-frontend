import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IBoard } from '@/interfaces/domain/IBoard'
import { archiveBoard } from '@/services/board'
import { useUndo } from '@/composables/useUndo'

interface ArchiveBoardVars {
  board: IBoard
}

export function useArchiveBoard() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'archive'],
    meta: {
      keysToInvalidate: [boardKeys.archived(), workspaceKeys.lists()],
    },
    mutationFn: ({ board }: ArchiveBoardVars) =>
      requestQueueService.enqueue(board.id, () => archiveBoard(board.id)),

    onMutate: async ({ board }) => {
      const queryKey = boardKeys.byWorkspace(board.workspace.id)

      await queryClient.cancelQueries({ queryKey })

      const previousBoards = queryClient.getQueryData<IBoard[]>(queryKey)

      if (previousBoards) {
        queryClient.setQueryData<IBoard[]>(queryKey, (old) =>
          old ? old.filter((c) => c.id !== board.id) : [],
        )
      }

      return { previousBoards, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(context.queryKey, context.previousBoards)
      }
    },

    onSuccess: (result) => {
      toast.success('Доска архивирована', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },

    onSettled: (data, error, { board }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(board.workspace.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(board.id) })
      queryClient.invalidateQueries({ queryKey: boardKeys.detailed(board.id) })
    },
  })
}
