import { computed, MaybeRef, Ref, toValue } from 'vue'
import { IBoard } from '@/interfaces/domain/IBoard'
import { useArchivedBoards } from './queries/useArchivedBoards'

export function useArchivedBoard(
  id: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
): Ref<IBoard | null> {
  const { data: archivedBoardsData } = useArchivedBoards(isEnabled)

  return computed(() => {
    return archivedBoardsData.value?.find((b) => b.id === toValue(id)) || null
  })
}
