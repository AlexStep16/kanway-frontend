import type { IBoard } from '~/interfaces/domain/IBoard'

export function useBoardSelector(
  id: MaybeRef<string | null>,
  workspaceId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
): Ref<IBoard | null> {
  const { data: boardData } = useBoards(workspaceId, isEnabled)

  return computed(() => {
    return boardData.value?.find((b) => b.id === toValue(id)) || null
  })
}
