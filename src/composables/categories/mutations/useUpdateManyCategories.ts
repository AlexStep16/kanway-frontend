import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { saveCategories } from '@/services/category'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { ICategoryEditApiPayload } from '@/interfaces/ICategoryEditApiPayload'

interface UpdateManyVars {
  payload: ICategoryEditApiPayload[]
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
      }

      return { snapshots }
    },

    onError: (err, vars, context) => {
      if (!context?.snapshots) return

      const { categories } = context.snapshots

      if (categories) {
        const failedIds = new Set(vars.payload.map((p) => p.id))
        const categoriesSnapshotMap = new Map(categories.map((c) => [c.id, c]))

        queryClient.setQueryData<ICategoryState[]>(categoryKeys.all, (current) => {
          return (
            current?.map((item) => {
              if (failedIds.has(item.id)) {
                return categoriesSnapshotMap.get(item.id) || item
              }
              return item
            }) || []
          )
        })
      }
    },

    onSettled: (result) => {
      if (!result) return

      const updatedCategories = result.data

      if (updatedCategories) {
        updatedCategories.forEach((category) => {
          queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
          queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(category.id) })
        })
      }
    },
  })
}
