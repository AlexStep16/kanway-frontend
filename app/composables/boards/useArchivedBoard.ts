import type { IBoard } from '~/interfaces/domain/IBoard'

export function useArchivedBoard(
  id: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
): Ref<IBoard | null> {
  const { data: archivedBoardsData } = useArchivedBoards(isEnabled)

  return computed(() => {
    return archivedBoardsData.value?.find((b) => b.id === toValue(id)) || null
  })
}
