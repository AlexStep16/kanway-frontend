export function useArchivedColumn(
  id: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: archivedColumnsData } = useArchivedColumns(isEnabled)

  return computed(() => {
    return archivedColumnsData.value?.find((c) => c.id === toValue(id)) || null
  })
}
