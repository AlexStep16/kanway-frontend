import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ITaskState } from '~/stores/interfaces/ITaskState'
import { saveTasks } from '~/services/task'
import type { ITaskEditApiPayload } from '~/interfaces/ITaskEditApiPayload'

export interface UpdateManyTaskVars {
  payload: ITaskEditApiPayload[]
}

export function useUpdateManyTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...taskKeys.all, 'updateMany'],
    mutationFn: ({ payload }: UpdateManyTaskVars) =>
      requestQueueService.enqueueBulk(
        payload.map((p) => p.id),
        () => saveTasks(payload),
      ),
    onMutate: async (vars) => {
      const tKey = taskKeys.all
      const cKey = categoryKeys.all
      const bKey = boardKeys.all
      const wKey = workspaceKeys.lists()

      await Promise.all([
        queryClient.cancelQueries({ queryKey: tKey }),
        queryClient.cancelQueries({ queryKey: cKey }),
        queryClient.cancelQueries({ queryKey: bKey }),
        queryClient.cancelQueries({ queryKey: wKey }),
      ])

      const snapshots = {
        tasks: queryClient.getQueryData<ITaskState[]>(tKey),
        categories: queryClient.getQueryData(cKey),
        boards: queryClient.getQueryData(bKey),
        workspaces: queryClient.getQueryData(wKey),
      }

      if (snapshots.tasks) {
        queryClient.setQueryData<ITaskState[]>(tKey, (old) => {
          if (!old) return []
          const updatesMap = new Map(vars.payload.map((p) => [p.id, p]))

          return old.map((t) => {
            const update = updatesMap.get(t.id)
            return update ? { ...t, ...update } : t
          })
        })
      }

      return { snapshots }
    },

    onError: (err, vars, context) => {
      if (!context?.snapshots) return

      const { tasks } = context.snapshots

      if (tasks) {
        const failedIds = new Set(vars.payload.map((p) => p.id))
        const tasksSnapshotMap = new Map(tasks.map((t) => [t.id, t]))

        queryClient.setQueryData<ITaskState[]>(taskKeys.all, (current) => {
          return (
            current?.map((item) => {
              if (failedIds.has(item.id)) {
                return tasksSnapshotMap.get(item.id) || item
              }
              return item
            }) || []
          )
        })
      }
    },

    onSettled: (result) => {
      if (!result) return

      const updatedTasks = result.data

      if (updatedTasks) {
        updatedTasks.forEach((task) => {
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.detailed(task.id) })
        })
      }
    },
  })
}
