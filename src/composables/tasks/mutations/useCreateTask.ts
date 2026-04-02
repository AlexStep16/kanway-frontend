import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ITask } from '@interfaces/domain/ITask'
import { createTask } from '@services/task'
import { queryClient } from '@/plugins/queryClient'
import { useUndo } from '@/composables/logs/useUndo'

export interface CreateTaskVars {
  payload: Partial<ITask>
  categoryId: string
  boardId: string | null
  workspaceId: string | null
}

export function useCreateTask() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'create'],
    mutationFn: async ({ payload, categoryId, boardId, workspaceId }: CreateTaskVars) => {
      if (!workspaceId) {
        throw new Error('Не выбрано пространство')
      }

      if (!boardId) {
        throw new Error('Не выбрана доска')
      }

      if (!categoryId) {
        throw new Error('Не выбрана категория')
      }

      return createTask(payload, categoryId, boardId, workspaceId)
    },

    onSuccess: async (result, { boardId, workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })

      queryClient.setQueryData(taskKeys.byBoard(boardId), (oldTasks: ITask[] | undefined) => {
        return oldTasks ? [...oldTasks, ...result.data] : result.data
      })

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
