import { computed, MaybeRef, toValue } from 'vue'
import { useCategories } from './queries/useCategories'

export function useCategory(
  id: MaybeRef<string | null>,
  boardId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: categoriesData } = useCategories(boardId, isEnabled)

  return computed(() => {
    return categoriesData.value?.find((c) => c.id === toValue(id)) || null
  })
}
