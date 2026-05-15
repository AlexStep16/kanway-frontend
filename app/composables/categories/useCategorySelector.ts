export function useCategorySelector(
  id: MaybeRef<string | null>,
  boardId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: categoriesData } = useCategories(boardId, isEnabled)

  return computed(() => {
    return categoriesData.value?.find((c) => c.id === toValue(id)) || null
  })
}
