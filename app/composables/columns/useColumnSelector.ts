export function useColumnSelector(
  id: MaybeRef<string | null>,
  boardId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: columnsData } = useColumns(boardId, isEnabled)

  return computed(() => {
    return columnsData.value?.find((c) => c.id === toValue(id)) || null
  })
}
