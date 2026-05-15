export function useArchivedWorkspace(
  id: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
) {
  const { data: archivedWorkspacesData } = useArchivedWorkspaces(isEnabled)

  return computed(() => {
    return archivedWorkspacesData.value?.find((w) => w.id === toValue(id)) || null
  })
}
