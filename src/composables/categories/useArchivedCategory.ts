import { computed, MaybeRef, toValue } from 'vue'
import { useArchivedCategories } from './queries/useArchivedCategories'

export function useArchivedCategory(
  id: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: archivedCategoriesData } = useArchivedCategories(isEnabled)

  return computed(() => {
    return archivedCategoriesData.value?.find((c) => c.id === toValue(id)) || null
  })
}
