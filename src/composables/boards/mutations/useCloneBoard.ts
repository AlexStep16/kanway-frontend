import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { cloneBoard } from '@/services/board'
import { useUndo } from '@/composables/useUndo'

interface CloneBoardVars {
  id: string
}

export function useCloneBoard() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...boardKeys.all, 'clone'],
    mutationFn: ({ id }: CloneBoardVars) => requestQueueService.enqueue(id, () => cloneBoard(id)),

    onSuccess: async (result) => {
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
