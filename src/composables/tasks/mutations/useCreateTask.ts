import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { taskKeys } from '@/keys'
import { ITask } from '@interfaces/domain/ITask'
import { createTask } from '@services/task'
import { queryClient } from '@/plugins/queryClient'
import { useUndo } from '@/composables/logs/useUndo'
import { ITaskCreateApiPayload } from '@/interfaces/ITaskCreateApiPayload'

export interface CreateTaskVars {
  payload: ITaskCreateApiPayload
}

export function useCreateTask() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'create'],
    mutationFn: async ({ payload }: CreateTaskVars) => createTask(payload),

    onSuccess: async (result, { payload }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(payload.boardId) })

      queryClient.setQueryData(
        taskKeys.byBoard(payload.boardId),
        (oldTasks: ITask[] | undefined) => {
          return oldTasks ? [...oldTasks, ...result.data] : result.data
        },
      )

      toast.success('Задача успешно создана', {
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
