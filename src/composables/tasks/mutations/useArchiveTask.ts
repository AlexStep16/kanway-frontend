import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { taskKeys } from '@/keys'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { requestQueueService } from '@/utils/RequestQueueService'
import { archiveTask } from '@/services/task'
import { useUndo } from '@/composables/useUndo'

export interface ArchiveTaskVars {
  task: ITaskState
}

export function useArchiveTask() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'archive'],
    mutationFn: ({ task }: ArchiveTaskVars) =>
      requestQueueService.enqueue(task.id, () => archiveTask(task.id)),

    onMutate: async ({ task }) => {
      const queryKey = taskKeys.byBoard(task.board.id)

      await queryClient.cancelQueries({ queryKey })

      const previousTasks = queryClient.getQueryData<ITaskState[]>(queryKey)

      if (previousTasks) {
        queryClient.setQueryData<ITaskState[]>(queryKey, (old) =>
          old ? old.filter((t) => t.id !== task.id) : [],
        )
      }

      return { previousTasks, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(context.queryKey, context.previousTasks)
      }
    },

    onSuccess: (result) => {
      toast.success('Задача архивирована', {
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
