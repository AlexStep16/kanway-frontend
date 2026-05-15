import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { cloneBoard } from '~/services/board'

interface CloneBoardVars {
  id: string
}

export function useCloneBoard() {
  const { mutate: undo } = useUndo()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...boardKeys.all, 'clone'],
    mutationFn: ({ id }: CloneBoardVars) => requestQueueService.enqueue(id, () => cloneBoard(id)),

    onSuccess: async (result) => {
      const newBoard = result.data[0]

      if (newBoard) {
        queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(newBoard.workspace.id) })
        queryClient.invalidateQueries({ queryKey: [...boardKeys.count(), newBoard.workspace.id] })
      }

      toast.success('Доска скопирована', {
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
