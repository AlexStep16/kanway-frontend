import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import { saveTask } from '~/services/task'
import type { ITaskEditApiPayload } from '~/interfaces/ITaskEditApiPayload'

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
      const queryTasksKey = vars.boardId ? taskKeys.byBoard(vars.boardId) : taskKeys.all
      const queryTaskKey = taskKeys.detailed(vars.payload.id)

      await queryClient.cancelQueries({ queryKey: queryTasksKey })
      await queryClient.cancelQueries({ queryKey: queryTaskKey })

      const previousTasks = queryClient.getQueryData<ITaskState[]>(queryTasksKey)
      const previousTask = queryClient.getQueryData<ITaskState>(queryTaskKey)

      if (previousTasks) {
        queryClient.setQueryData<ITaskState[]>(queryTasksKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      if (previousTask) {
        queryClient.setQueryData<ITaskState | null>(queryTaskKey, (old) => {
          if (!old) return null
          return { ...old, ...vars.payload }
        })
      }

      return { previousTasks, previousTask, queryTasksKey, queryTaskKey }
    },

    onSettled: (data, error, { boardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.archived() })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.detailed(payload.id) })
    },

    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        const originalTask = context.previousTasks.find((t) => t.id === vars.payload.id)

        if (originalTask) {
          queryClient.setQueryData<ITaskState[]>(context.queryTasksKey, (current) => {
            return current?.map((t) => (t.id === vars.payload.id ? originalTask : t)) ?? []
          })
        }
      }

      if (context?.previousTask) {
        queryClient.setQueryData<ITaskState>(context.queryTaskKey, context.previousTask)
      }
    },
  })
}
