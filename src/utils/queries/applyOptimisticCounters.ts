import { QueryClient } from '@tanstack/vue-query'

export function applyOptimisticCounters<T extends { id: string; tasksCount?: number }>(
  queryClient: QueryClient,
  queryKey: any[],
  deltas: Map<string, number>,
) {
  if (deltas.size === 0) return

  queryClient.setQueryData<T[]>(queryKey, (old) => {
    if (!old) return []

    return old.map((item) => {
      const delta = deltas.get(item.id)
      if (delta) {
        return { ...item, tasksCount: (item.tasksCount || 0) + delta }
      }
      return item
    })
  })
}
