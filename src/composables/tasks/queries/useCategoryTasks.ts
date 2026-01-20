import { useQuery, useQueryClient } from '@tanstack/vue-query' // Рекомендую использовать хук
import { computed, MaybeRef, toValue } from 'vue'
import { taskKeys } from '@/keys'
import { fetchTasks } from '@services/task'
import { ITaskState } from '@/stores/interfaces/ITaskState'

export function useCategoryTasks(
  boardId: MaybeRef<string | null>,
  categoryId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: taskKeys.byCategory(categoryId),
    queryFn: () => fetchTasks(toValue(boardId)!, toValue(categoryId)!),
    enabled: computed(() => !!toValue(categoryId) && !!toValue(boardId) && toValue(isEnabled)),
    placeholderData: (prev) => prev,
    initialData: () => {
      const bId = toValue(boardId)
      const cId = toValue(categoryId)
      if (!bId || !cId) return []

      const boardTasks = queryClient.getQueryData<ITaskState[]>(taskKeys.byBoard(bId))

      if (boardTasks) {
        return boardTasks.filter((t) => t.category.id === cId)
      }

      return []
    },

    initialDataUpdatedAt: () => {
      const bId = toValue(boardId)

      return queryClient.getQueryState(taskKeys.byBoard(bId))?.dataUpdatedAt
    },

    staleTime: 1000 * 60 * 5,
  })
}
