import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { ITaskState } from '@/stores/interfaces/ITaskState'
import { saveTasks } from '@/services/task'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { calculateCounterDeltas } from '@/utils/queries/calculateCounterDeltas'
import { applyOptimisticCounters } from '@/utils/queries/applyOptimisticCounters'

export interface UpdateManyTaskVars {
  payload: ISingleUpdate<ITaskState>[]
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

        const catDeltas = calculateCounterDeltas(snapshots.tasks, vars.payload, 'category')
        applyOptimisticCounters<ICategoryState>(queryClient, cKey, catDeltas)

        const boardDeltas = calculateCounterDeltas(snapshots.tasks, vars.payload, 'board')
        applyOptimisticCounters(queryClient, bKey, boardDeltas)

        const workspaceDeltas = calculateCounterDeltas(snapshots.tasks, vars.payload, 'workspace')
        applyOptimisticCounters(queryClient, wKey, workspaceDeltas)
      }

      return { snapshots }
    },

    onError: (err, vars, context) => {
      if (!context?.snapshots) return

      const { tasks, categories, boards, workspaces } = context.snapshots

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

        if (categories) {
          const categoryDeltas = calculateCounterDeltas(tasks, vars.payload, 'category')

          const invertedCategoryDeltas = new Map<string, number>()
          categoryDeltas.forEach((val, id) => {
            invertedCategoryDeltas.set(id, -val)
          })

          applyOptimisticCounters(queryClient, categoryKeys.all, invertedCategoryDeltas)
        }

        if (boards) {
          const boardDeltas = calculateCounterDeltas(tasks, vars.payload, 'board')

          const invertedBoardDeltas = new Map<string, number>()
          boardDeltas.forEach((val, id) => {
            invertedBoardDeltas.set(id, -val)
          })

          applyOptimisticCounters(queryClient, boardKeys.all, invertedBoardDeltas)
        }

        if (workspaces) {
          const workspaceDeltas = calculateCounterDeltas(tasks, vars.payload, 'workspace')
          const invertedWorkspaceDeltas = new Map<string, number>()
          workspaceDeltas.forEach((val, id) => {
            invertedWorkspaceDeltas.set(id, -val)
          })

          applyOptimisticCounters(queryClient, workspaceKeys.lists(), invertedWorkspaceDeltas)
        }
      }
    },

    onSettled: (result) => {
      if (!result) return

      const updatedTasks = result.data

      if (updatedTasks) {
        updatedTasks.forEach((task) => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(task.board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(task.board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.detailed(task.id) })
        })
      }
    },
  })
}
