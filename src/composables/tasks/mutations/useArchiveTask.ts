import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { requestQueueService } from '@/utils/RequestQueueService'
import { archiveTask } from '@/services/task'
import { useUndo } from '@/composables/logs/useUndo'

export interface ArchiveTaskVars {
  task: ITaskState
}

export function useArchiveTask() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'archive'],
    meta: {
      keysToInvalidate: [taskKeys.archived(), workspaceKeys.lists()],
    },
    mutationFn: ({ task }: ArchiveTaskVars) =>
      requestQueueService.enqueue(task.id, () => archiveTask(task.id)),

    onMutate: async ({ task }) => {
      const actualTasksKey = taskKeys.byBoard(task.board.id)
      const archivedTasksKey = taskKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualTasksKey })
      await queryClient.cancelQueries({ queryKey: archivedTasksKey })

      const prevTasks = queryClient.getQueryData<ITaskState[]>(actualTasksKey)
      const prevArchived = queryClient.getQueryData<ITaskState[]>(archivedTasksKey)

      if (prevTasks) {
        queryClient.setQueryData<ITaskState[]>(actualTasksKey, (old) =>
          old ? old.filter((t) => t.id !== task.id) : [],
        )
      }

      if (prevArchived) {
        queryClient.setQueryData<ITaskState[]>(archivedTasksKey, (old) =>
          old ? [...old, { ...task, isDeleted: true }] : [{ ...task, isDeleted: true }],
        )
      }

      return { prevArchived, prevTasks, archivedTasksKey, actualTasksKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevTasks) {
        const taskToRestore = context.prevTasks.find((t) => t.id === vars.task.id)

        if (taskToRestore) {
          queryClient.setQueryData<ITaskState[]>(context.actualTasksKey, (current) => {
            if (current?.some((t) => t.id === vars.task.id)) return current
            return [taskToRestore, ...(current || [])]
          })
        }
      }

      if (context?.archivedTasksKey) {
        queryClient.setQueryData<ITaskState[]>(context.archivedTasksKey, (current) => {
          return current?.filter((t) => t.id !== vars.task.id) || []
        })
      }
    },

    onSettled: (data, error, { task }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(task.workspace.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(task.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(task.id) })
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
