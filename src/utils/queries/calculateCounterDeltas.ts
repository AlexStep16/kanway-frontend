import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'

export function calculateCounterDeltas<
  T extends {
    id: string
    category?: { id: string }
    board?: { id: string }
    workspace: { id: string }
  },
>(
  previousEntities: T[],
  updates: ISingleUpdate<{
    category?: { id: string }
    board?: { id: string }
    workspace?: { id: string }
  }>[],
  parentField: 'workspace' | 'board' | 'category',
) {
  const deltas = new Map<string, number>()
  const prevEntitiesMap = new Map(previousEntities.map((t) => [t.id, t]))

  updates.forEach((update) => {
    const prevEntity = prevEntitiesMap.get(update.id)
    const newParentId = update[parentField]?.id

    if (prevEntity && newParentId !== undefined && newParentId !== prevEntity[parentField]?.id) {
      const oldParentId = prevEntity[parentField]?.id

      if (oldParentId) {
        deltas.set(oldParentId, (deltas.get(oldParentId) || 0) - 1)
      }

      if (newParentId) {
        deltas.set(newParentId, (deltas.get(newParentId) || 0) + 1)
      }
    }
  })

  return deltas
}
