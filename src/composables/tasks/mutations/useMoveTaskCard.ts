import { useMutation } from '@tanstack/vue-query'
import { taskKeys, workspaceKeys } from '@/keys'
import { moveTask } from '@services/task'
import { queryClient } from '@/plugins/queryClient'
import { Nullable } from '@/types/utils'
import { MaybeRef } from 'vue'

export interface MoveTaskCardVars {
  id: string
  beforeId?: Nullable<string>
  afterId?: Nullable<string>
  newCategoryId?: string
  boardId: MaybeRef<Nullable<string>>
}

export function useMoveTaskCard() {
  return useMutation({
    mutationKey: [...taskKeys.all, 'move-card'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ id, beforeId, afterId, newCategoryId }: MoveTaskCardVars) =>
      moveTask({ id, beforeId, afterId, newCategoryId }),

    onSuccess: async (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(boardId) })
    },
  })
}
