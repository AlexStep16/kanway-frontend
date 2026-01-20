import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { taskKeys } from '@/keys' // Твои ключи кэша
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { requestQueueService } from '@/utils/RequestQueueService'
import { removeTask } from '@/services/task'

export interface DeleteTaskVars {
  task: ITaskState
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'delete'],
    mutationFn: ({ task }: DeleteTaskVars) =>
      requestQueueService.enqueue(task.id, () => removeTask(task.id)),
    onMutate: async ({ task }) => {
      const taskKey = taskKeys.byBoard(task.board.id)

      await queryClient.cancelQueries({ queryKey: taskKey })

      const previousTasks = queryClient.getQueryData<ITaskState[]>(taskKey)

      if (previousTasks) {
        queryClient.setQueryData<ITaskState[]>(taskKey, (oldTasks) =>
          oldTasks ? oldTasks.filter((t) => t.id !== task.id) : [],
        )
      }

      return { previousTasks, taskKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(context.taskKey, context.previousTasks)
      }
    },

    onSuccess: () => {
      toast.success('Задача успешно удалена')
    },
  })
}
