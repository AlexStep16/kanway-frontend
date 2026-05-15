import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import { requestQueueService } from '~/utils/RequestQueueService'
import { removeTask } from '~/services/task'

export interface DeleteTaskVars {
  task: ITaskState
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'delete'],
    meta: {
      keysToInvalidate: [taskKeys.archived()],
    },
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
        const taskToRestore = context.previousTasks.find((t) => t.id === vars.task.id)

        if (taskToRestore) {
          queryClient.setQueryData<ITaskState[]>(context.taskKey, (current) => {
            if (current?.some((t) => t.id === vars.task.id)) return current

            return [taskToRestore, ...(current || [])]
          })
        }
      }
    },

    onSuccess: () => {
      toast.success('Задача успешно удалена')
    },

    onSettled: (data, error, { task }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(task.id) })
    },
  })
}
