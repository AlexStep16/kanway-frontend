import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { moveTask } from '~/services/task'
import type { ITaskState } from '~/stores/interfaces/ITaskState'

export interface MoveTaskCardVars {
  id: string
  beforeId?: string | null
  afterId?: string | null
  newCategoryId?: string
  boardId: MaybeRef<string | null>
}

export function useMoveTaskCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'move-card'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ id, beforeId, afterId, newCategoryId }: MoveTaskCardVars) =>
      moveTask({ id, beforeId, afterId, newCategoryId }),

    onMutate: async (vars) => {
      const queryKey = taskKeys.byBoard(vars.boardId)

      await queryClient.cancelQueries({ queryKey })

      const previousTasks = queryClient.getQueryData<ITaskState[]>(queryKey)

      queryClient.setQueryData(queryKey, (oldTasks: ITaskState[] | undefined) => {
        if (!oldTasks) return []

        oldTasks.map((task) => {
          if (task.id === vars.id) {
            return { ...task, category: vars.newCategoryId ?? task.category }
          }
          return task
        })
      })

      return { previousTasks, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(context.queryKey, context.previousTasks)
      }
    },

    onSettled: (data, error, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
    },
  })
}
