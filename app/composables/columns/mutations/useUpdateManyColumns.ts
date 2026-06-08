import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { saveColumns } from '~/services/column'
import type { IColumnState } from '~/stores/interfaces/IColumnState'
import type { IColumnEditApiPayload } from '~/interfaces/IColumnEditApiPayload'

interface UpdateManyVars {
  payload: IColumnEditApiPayload[]
}

export function useUpdateManyColumns() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...columnKeys.all, 'updateMany'],
    mutationFn: ({ payload }: UpdateManyVars) =>
      requestQueueService.enqueueBulk(
        payload.map((p) => p.id),
        () => saveColumns(payload),
      ),

    onMutate: async (vars) => {
      const cKey = columnKeys.all
      const bKey = boardKeys.all
      const wKey = workspaceKeys.lists()

      await Promise.all([
        queryClient.cancelQueries({ queryKey: cKey }),
        queryClient.cancelQueries({ queryKey: bKey }),
        queryClient.cancelQueries({ queryKey: wKey }),
      ])

      const snapshots = {
        columns: queryClient.getQueryData<IColumnState[]>(cKey),
        boards: queryClient.getQueryData(bKey),
        workspaces: queryClient.getQueryData(wKey),
      }

      if (snapshots.columns) {
        queryClient.setQueryData<IColumnState[]>(cKey, (old) => {
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

      const { columns } = context.snapshots

      if (columns) {
        const failedIds = new Set(vars.payload.map((p) => p.id))
        const columnsSnapshotMap = new Map(columns.map((c) => [c.id, c]))

        queryClient.setQueryData<IColumnState[]>(columnKeys.all, (current) => {
          return (
            current?.map((item) => {
              if (failedIds.has(item.id)) {
                return columnsSnapshotMap.get(item.id) || item
              }
              return item
            }) || []
          )
        })
      }
    },

    onSettled: (result) => {
      if (!result) return

      const updatedColumns = result.data

      if (updatedColumns) {
        updatedColumns.forEach((column) => {
          queryClient.invalidateQueries({ queryKey: columnKeys.byBoard(column.board.id) })
          queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(column.board.id) })
          queryClient.invalidateQueries({ queryKey: columnKeys.detailed(column.id) })
        })
      }
    },
  })
}
