import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { cloneTask } from '~/services/task'

export interface CloneTaskVars {
  id: string
}

export function useCloneTask() {
  const { mutate: undo } = useUndo()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'clone'],
    mutationFn: ({ id }: CloneTaskVars) => {
      return requestQueueService.enqueue(id, () => cloneTask(id))
    },

    onSuccess: async (result) => {
      const newTask = result.data[0]

      if (newTask) {
        queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(newTask.board.id) })
      }

      toast.success('Задача скопирована', {
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
