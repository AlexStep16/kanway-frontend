import { boardKeys } from '@/keys'
import { useMutationState } from '@tanstack/vue-query'
import { computed, type MaybeRef, toValue } from 'vue'

export function useBoardMutationStatus(boardId: MaybeRef<string | null>) {
  if (!toValue(boardId))
    return {
      isArchiving: computed(() => false),
      isRecovering: computed(() => false),
      isCloning: computed(() => false),
      isFavoritePending: computed(() => false),
      isMoving: computed(() => false),
      isDeleting: computed(() => false),
      isUpdating: computed(() => false),
      isUpdatingMany: computed(() => false),
      isBusy: computed(() => false),
    }

  const pendingBoardMutations = useMutationState({
    filters: {
      status: 'pending',
      predicate: (mutation) => {
        const key = mutation.options.mutationKey as string[]
        return key?.includes(boardKeys.all[0])
      },
    },
    select: (mutation) => ({
      key: mutation.options.mutationKey as string[],
      variables: mutation.state.variables as any,
    }),
  })

  const checkStatus = (action: string, type: 'board' | 'payload' | 'array' = 'board') => {
    return computed(() => {
      return pendingBoardMutations.value.some((m) => {
        if (!m.key.includes(action)) return false

        const v = m.variables
        if (type === 'board') return v?.board?.id === toValue(boardId)
        if (type === 'payload') return v?.payload?.id === toValue(boardId)
        if (type === 'array') return v?.payload?.some((p: any) => p.id === toValue(boardId))
        return false
      })
    })
  }

  const isArchiving = checkStatus('archive')
  const isFavoritePending = checkStatus('favorite')
  const isRecovering = checkStatus('recover')
  const isCloning = checkStatus('clone')
  const isDeleting = checkStatus('delete')
  const isMoving = checkStatus('move', 'payload')
  const isUpdating = checkStatus('update', 'payload')
  const isUpdatingMany = checkStatus('updateMany', 'array')

  const isBusy = computed(
    () =>
      isArchiving.value ||
      isFavoritePending.value ||
      isRecovering.value ||
      isCloning.value ||
      isMoving.value ||
      isDeleting.value ||
      isUpdating.value ||
      isUpdatingMany.value,
  )

  return {
    isArchiving,
    isFavoritePending,
    isRecovering,
    isCloning,
    isMoving,
    isDeleting,
    isUpdating,
    isUpdatingMany,
    isBusy,
  }
}
