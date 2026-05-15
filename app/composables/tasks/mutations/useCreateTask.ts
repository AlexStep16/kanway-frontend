import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { ITask } from '~/interfaces/domain/ITask'
import { createTask } from '~/services/task'
import type { ITaskCreateApiPayload } from '~/interfaces/ITaskCreateApiPayload'

export interface CreateTaskVars {
  payload: ITaskCreateApiPayload
}

export function useCreateTask() {
  const queryClient = useQueryClient()
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
