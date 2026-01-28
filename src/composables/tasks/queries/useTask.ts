import { taskKeys } from '@/keys'
import { fetchTask } from '@/services/task'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useTask as useTaskFunction } from '../useTask'
import { MaybeRef, toValue } from 'vue'

export function useTask(id: MaybeRef<string>, boardId?: MaybeRef<string | null>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: taskKeys.detailed(id),
    queryFn: () => fetchTask(toValue(id)),
    enabled: !!toValue(id),

    initialData: () => {
      if (!boardId) return undefined

      return useTaskFunction(id, boardId).value ?? undefined
    },

    initialDataUpdatedAt: () => {
      return boardId
        ? queryClient.getQueryState(taskKeys.byBoard(boardId))?.dataUpdatedAt
        : undefined
    },

    staleTime: 1000 * 60 * 5,
  })
}
