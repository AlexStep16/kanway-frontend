import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { requestQueueService } from '@/utils/RequestQueueService'
import { recoverTask } from '@/services/task'
import { useUndo } from '@/composables/log/useUndo'

export interface RecoverTaskVars {
  task: ITaskState
}

export function useRecoverTask() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'recover'],
    meta: {
      keysToInvalidate: [taskKeys.archived()],
    },
    mutationFn: ({ task }: RecoverTaskVars) =>
      requestQueueService.enqueue(task.id, () => recoverTask(task.id)),
    onMutate: async ({ task }) => {
      const actualTasksKey = taskKeys.byBoard(task.board.id)
      const archivedTasksKey = taskKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualTasksKey })
      await queryClient.cancelQueries({ queryKey: archivedTasksKey })

      const prevArchived = queryClient.getQueryData<ITaskState[]>(archivedTasksKey)
      const prevTasks = queryClient.getQueryData<ITaskState[]>(actualTasksKey)

      if (prevArchived) {
        queryClient.setQueryData<ITaskState[]>(archivedTasksKey, (old) =>
          old ? old.filter((t) => t.id !== task.id) : [],
        )
      }

      if (prevTasks) {
        queryClient.setQueryData<ITaskState[]>(actualTasksKey, (old) =>
          old ? [...old, { ...task, isDeleted: false }] : [{ ...task, isDeleted: false }],
        )
      }

      return { prevArchived, prevTasks, archivedTasksKey, actualTasksKey }
    },

    onError: (err, vars, context) => {
      if (context?.actualTasksKey) {
        queryClient.setQueryData<ITaskState[]>(context.actualTasksKey, (current) => {
          return current?.filter((t) => t.id !== vars.task.id) || []
        })
      }

      if (context?.prevArchived) {
        const taskToRestore = context.prevArchived.find((t) => t.id === vars.task.id)

        if (taskToRestore) {
          queryClient.setQueryData<ITaskState[]>(context.archivedTasksKey, (current) => {
            if (current?.some((t) => t.id === vars.task.id)) return current
            return [taskToRestore, ...(current || [])]
          })
        }
      }
    },

    onSuccess: (result) => {
      toast.success('Задача восстановлена', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },

    onSettled: (result, error, { task }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(task.id) })
    },
  })
}
