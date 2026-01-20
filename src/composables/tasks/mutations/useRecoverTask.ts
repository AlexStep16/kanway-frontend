import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { taskKeys } from '@/keys'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { requestQueueService } from '@/utils/RequestQueueService'
import { recoverTask } from '@/services/task'
import { useUndo } from '@/composables/useUndo'

export interface RecoverTaskVars {
  task: ITaskState
}

export function useRecoverTask() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'recover'],
    mutationFn: ({ task }: RecoverTaskVars) =>
      requestQueueService.enqueue(task.id, () => recoverTask(task.id)),
    onMutate: async ({ task }) => {
      const actualTasksKey = taskKeys.byBoard(task.board.id)
      const archivedTasksKey = taskKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualTasksKey })
      await queryClient.cancelQueries({ queryKey: archivedTasksKey })

      const prevArchived = queryClient.getQueryData<ITaskState[]>(archivedTasksKey)
      const prevBoard = queryClient.getQueryData<ITaskState[]>(actualTasksKey)

      if (prevArchived) {
        queryClient.setQueryData<ITaskState[]>(archivedTasksKey, (old) =>
          old ? old.filter((t) => t.id !== task.id) : [],
        )
      }

      if (prevBoard) {
        queryClient.setQueryData<ITaskState[]>(actualTasksKey, (old) => {
          if (!old) return []

          return [...old, { ...task, isDeleted: false }]
        })
      }

      return { prevArchived, prevBoard, archivedTasksKey, actualTasksKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevArchived) {
        queryClient.setQueryData(context.archivedTasksKey, context.prevArchived)
      }
      if (context?.prevBoard) {
        queryClient.setQueryData(context.actualTasksKey, context.prevBoard)
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
  })
}
