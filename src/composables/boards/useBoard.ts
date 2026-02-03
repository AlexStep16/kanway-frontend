import { computed, MaybeRef, Ref, toValue } from 'vue'
import { useBoards } from './queries/useBoards'
import { IBoard } from '@/interfaces/domain/IBoard'

export function useBoard(
  id: MaybeRef<string | null>,
  workspaceId: MaybeRef<string | null>,
  isEnabled: MaybeRef<boolean> = true,
): Ref<IBoard | null> {
  const { data: boardData } = useBoards(workspaceId, isEnabled)

  return computed(() => {
    return boardData.value?.find((b) => b.id === toValue(id)) || null
  })
}
