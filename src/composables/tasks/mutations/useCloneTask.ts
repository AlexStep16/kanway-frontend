import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { taskKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { cloneTask } from '@/services/task'
import { useUndo } from '@/composables/useUndo'

export interface CloneTaskVars {
  id: string
}

export function useCloneTask() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'clone'],
    mutationFn: ({ id }: CloneTaskVars) => {
      return requestQueueService.enqueue(id, () => cloneTask(id))
    },

    onSuccess: async (result) => {
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
