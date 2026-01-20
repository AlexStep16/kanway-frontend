import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, workspaceKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { saveCategories } from '@/services/category'
import { calculateCounterDeltas } from '@/utils/queries/calculateCounterDeltas'
import { applyOptimisticCounters } from '@/utils/queries/applyOptimisticCounters'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'

interface UpdateManyVars {
  payload: ISingleUpdate<ICategoryState>[]
}

export function useUpdateManyCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'updateMany'],
    mutationFn: ({ payload }: UpdateManyVars) =>
      requestQueueService.enqueueBulk(
        payload.map((p) => p.id),
        () => saveCategories(payload),
      ),

    onMutate: async (vars) => {
      const cKey = categoryKeys.all
      const bKey = boardKeys.all
      const wKey = workspaceKeys.lists()

      await Promise.all([
        queryClient.cancelQueries({ queryKey: cKey }),
        queryClient.cancelQueries({ queryKey: bKey }),
        queryClient.cancelQueries({ queryKey: wKey }),
      ])

      const snapshots = {
        categories: queryClient.getQueryData<ICategoryState[]>(cKey),
        boards: queryClient.getQueryData(bKey),
        workspaces: queryClient.getQueryData(wKey),
      }

      if (snapshots.categories) {
        queryClient.setQueryData<ICategoryState[]>(cKey, (old) => {
          if (!old) return []
          const updatesMap = new Map(vars.payload.map((p) => [p.id, p]))

          return old.map((t) => {
            const update = updatesMap.get(t.id)
            return update ? { ...t, ...update } : t
          })
        })

        const boardDeltas = calculateCounterDeltas(snapshots.categories, vars.payload, 'board')
        applyOptimisticCounters(queryClient, bKey, boardDeltas)

        const workspaceDeltas = calculateCounterDeltas(
          snapshots.categories,
          vars.payload,
          'workspace',
        )
        applyOptimisticCounters(queryClient, wKey, workspaceDeltas)
      }

      return { snapshots }
    },

    onError: (err, vars, context) => {
      if (context?.snapshots) {
        queryClient.setQueryData(categoryKeys.all, context.snapshots.categories)
        queryClient.setQueryData(boardKeys.all, context.snapshots.boards)
        queryClient.setQueryData(workspaceKeys.lists(), context.snapshots.workspaces)
      }
    },
  })
}
