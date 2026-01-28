import { computed, MaybeRef, toValue } from 'vue'
import { useCategories } from './queries/useCategories'

export function useCategory(id: MaybeRef<string | null>, boardId: MaybeRef<string | null>) {
  const { data: allCategories } = useCategories(boardId)

  return computed(() => {
    return allCategories.value?.find((c) => c.id === toValue(id)) || null
  })
}
