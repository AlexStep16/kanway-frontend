import { workspaceKeys } from '@/keys'
import { useMutationState } from '@tanstack/vue-query'
import { computed, type MaybeRef, toValue } from 'vue'

export function useWorkspaceMutationStatus(workspaceId: MaybeRef<string | null>) {
  if (!toValue(workspaceId))
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

  const pendingWorkspaceMutations = useMutationState({
    filters: {
      status: 'pending',
      predicate: (mutation) => {
        const key = mutation.options.mutationKey as string[]
        return key?.includes(workspaceKeys.all[0])
      },
    },
    select: (mutation) => ({
      key: mutation.options.mutationKey as string[],
      variables: mutation.state.variables as any,
    }),
  })

  const checkStatus = (action: string, type: 'workspace' | 'payload' | 'array' = 'workspace') => {
    return computed(() => {
      return pendingWorkspaceMutations.value.some((m) => {
        if (!m.key.includes(action)) return false

        const v = m.variables
        if (type === 'workspace') return v?.workspace?.id === toValue(workspaceId)
        if (type === 'payload') return v?.payload?.id === toValue(workspaceId)
        if (type === 'array') return v?.payload?.some((p: any) => p.id === toValue(workspaceId))
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

  const isBusy = computed(
    () =>
      isArchiving.value ||
      isRecovering.value ||
      isCloning.value ||
      isMoving.value ||
      isDeleting.value ||
      isUpdating.value,
  )

  return {
    isArchiving,
    isRecovering,
    isCloning,
    isMoving,
    isDeleting,
    isUpdating,
    isBusy,
  }
}
