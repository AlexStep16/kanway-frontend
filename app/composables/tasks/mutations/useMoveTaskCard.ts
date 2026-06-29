import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { moveTask } from '~/services/task'
import type { ITaskState } from '~/stores/interfaces/ITaskState'

export interface MoveTaskCardVars {
  id: string
  beforeId?: string | null
  afterId?: string | null
  newColumnId?: string
  boardId: MaybeRef<string | null>
}

export function useMoveTaskCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'move-card'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ id, beforeId, afterId, newColumnId }: MoveTaskCardVars) =>
      moveTask({ id, beforeId, afterId, newColumnId }),

    onMutate: async (vars) => {
      const queryKey = taskKeys.byBoard(vars.boardId)

      await queryClient.cancelQueries({ queryKey })

      const previousTasks = queryClient.getQueryData<ITaskState[]>(queryKey)

      queryClient.setQueryData(queryKey, (oldTasks: ITaskState[] | undefined) => {
        if (!oldTasks) return []

        const movingTask = oldTasks.find((task) => task.id === vars.id)

        if (!movingTask) return oldTasks

        const nextTasks = oldTasks.filter((task) => task.id !== vars.id)

        let insertIndex = nextTasks.length

        if (vars.afterId) {
          const afterIndex = nextTasks.findIndex((task) => task.id === vars.afterId)

          if (afterIndex !== -1) {
            insertIndex = afterIndex + 1
          }
        } else if (vars.beforeId) {
          const beforeIndex = nextTasks.findIndex((task) => task.id === vars.beforeId)

          if (beforeIndex !== -1) {
            insertIndex = beforeIndex
          }
        }

        nextTasks.splice(insertIndex, 0, {
          ...movingTask,
          column: vars.newColumnId
            ? { ...movingTask.column, id: vars.newColumnId }
            : movingTask.column,
        })

        return nextTasks
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
