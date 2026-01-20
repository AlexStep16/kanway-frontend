import { QueryClient } from '@tanstack/vue-query'

export const patchCounter = (
  queryClient: QueryClient,
  queryKey: any[],
  entityId: string,
  field: string,
  delta: number,
) => {
  queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
    if (!old) return old
    return old.map((item) => {
      const id = item.id || item._id
      if (id === entityId) {
        return { ...item, [field]: (item[field] || 0) + delta }
      }
      return item
    })
  })
}
