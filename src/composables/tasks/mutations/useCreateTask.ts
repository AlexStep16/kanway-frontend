import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ITask } from '@interfaces/domain/ITask'
import { createTask } from '@services/task'
import { queryClient } from '@/plugins/queryClient'
import { patchCounter } from '@/utils/queries/patchCounter'
import { useUndo } from '@/composables/useUndo'

export interface CreateTaskVars {
  payload: Partial<ITask>
  boardId: string | null
  workspaceId: string | null
}

export function useCreateTask() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...taskKeys.all, 'create'],
    mutationFn: async ({ payload, boardId, workspaceId }: CreateTaskVars) => {
      if (!workspaceId) {
        throw new Error('Не выбрано пространство')
      }

      if (!boardId) {
        throw new Error('Не выбрана доска')
      }

      return createTask(payload, boardId, workspaceId)
    },

    onSuccess: async (result, { boardId, workspaceId, payload }) => {
      patchCounter(
        queryClient,
        categoryKeys.byBoard(boardId),
        payload.category?.id || '',
        'tasksCount',
        1,
      )
      patchCounter(queryClient, boardKeys.byWorkspace(workspaceId), boardId!, 'tasksCount', 1)
      patchCounter(queryClient, workspaceKeys.all, workspaceId!, 'tasksCount', 1)

      if (result.data.length === 0) {
        return toast.error('Произошла ошибка при создании задачи')
      }

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
