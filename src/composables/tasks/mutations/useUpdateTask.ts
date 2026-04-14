import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { taskKeys } from '@/keys'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { saveTask } from '@/services/task'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ITaskEditApiPayload } from '@/interfaces/ITaskEditApiPayload'

export interface UpdateTaskVars {
  payload: ITaskEditApiPayload
  boardId: string | null
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateTaskVars) =>
      requestQueueService.enqueue(payload.id, () => saveTask(payload)),
    onMutate: async (vars) => {
      const queryKey = vars.boardId ? taskKeys.byBoard(vars.boardId) : taskKeys.all

      await queryClient.cancelQueries({ queryKey })

      const previousTasks = queryClient.getQueryData<ITaskState[]>(queryKey)

      if (previousTasks) {
        queryClient.setQueryData<ITaskState[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      return { previousTasks, queryKey }
    },

    onSettled: (data, error, { boardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        const originalTask = context.previousTasks.find((t) => t.id === vars.payload.id)

        if (originalTask) {
          queryClient.setQueryData<ITaskState[]>(context.queryKey, (current) => {
            return current?.map((t) => (t.id === vars.payload.id ? originalTask : t)) ?? []
          })
        }
      }
    },
  })
}
