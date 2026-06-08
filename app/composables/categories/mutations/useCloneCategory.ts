import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { cloneColumn } from '~/services/column'

interface CloneColumnVars {
  id: string
}

export function useCloneColumn() {
  const { mutate: undo } = useUndo()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...columnKeys.all, 'clone'],
    mutationFn: ({ id }: CloneColumnVars) => requestQueueService.enqueue(id, () => cloneColumn(id)),

    onSuccess: async (result) => {
      const newColumn = result.data[0]

      if (newColumn) {
        queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(newColumn.board.id) })
      }

      toast.success('Категория скопирована', {
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
