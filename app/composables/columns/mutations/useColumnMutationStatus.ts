import { useMutationState } from '@tanstack/vue-query'

export function useColumnMutationStatus(columnId: MaybeRef<string | null>) {
  if (!columnId)
    return {
      isArchiving: computed(() => false),
      isRecovering: computed(() => false),
      isCloning: computed(() => false),
      isMoving: computed(() => false),
      isDeleting: computed(() => false),
      isUpdating: computed(() => false),
      isUpdatingMany: computed(() => false),
      isBusy: computed(() => false),
    }

  const pendingColumnMutations = useMutationState({
    filters: {
      status: 'pending',
      predicate: (mutation) => {
        const key = mutation.options.mutationKey as string[]
        return key?.includes(columnKeys.all[0]!)
      },
    },
    select: (mutation) => ({
      key: mutation.options.mutationKey as string[],
      variables: mutation.state.variables as any,
    }),
  })

  const checkStatus = (action: string, type: 'column' | 'payload' | 'array' = 'column') => {
    return computed(() => {
      return pendingColumnMutations.value.some((m) => {
        if (!m.key.includes(action)) return false

        const v = m.variables
        if (type === 'column') return v?.column?.id === toValue(columnId)
        if (type === 'payload') return v?.payload?.id === toValue(columnId)
        if (type === 'array') return v?.payload?.some((p: any) => p.id === toValue(columnId))
        return false
      })
    })
  }

  const isArchiving = checkStatus('archive')
  const isRecovering = checkStatus('recover')
  const isCloning = checkStatus('clone')
  const isDeleting = checkStatus('delete')
  const isMoving = checkStatus('move', 'payload')
  const isUpdating = checkStatus('update', 'payload')
  const isUpdatingMany = checkStatus('updateMany', 'array')

  const isBusy = computed(
    () =>
      isArchiving.value ||
      isRecovering.value ||
      isCloning.value ||
      isMoving.value ||
      isDeleting.value ||
      isUpdating.value ||
      isUpdatingMany.value,
  )

  return {
    isArchiving,
    isRecovering,
    isCloning,
    isMoving,
    isDeleting,
    isUpdating,
    isUpdatingMany,
    isBusy,
  }
}
