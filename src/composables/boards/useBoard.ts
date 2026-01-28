import { computed, MaybeRef, Ref, toValue } from 'vue'
import { useBoards } from './queries/useBoards'
import { IBoard } from '@/interfaces/domain/IBoard'

export function useBoard(
  id: MaybeRef<string | null>,
  workspaceId: MaybeRef<string | null>,
): Ref<IBoard | null> {
  const { data: allBoards } = useBoards(workspaceId)

  return computed(() => {
    return allBoards.value?.find((b) => b.id === toValue(id)) || null
  })
}
