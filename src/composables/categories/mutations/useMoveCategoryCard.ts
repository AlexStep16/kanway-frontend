import { useMutation } from '@tanstack/vue-query'
import { categoryKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { Nullable } from '@/types/utils'
import { moveCategory } from '@/services/category'
import { MaybeRef } from 'vue'

export interface MoveCategoryCardVars {
  id: string
  beforeId?: Nullable<string>
  afterId?: Nullable<string>
  newBoardId?: string
  boardId: MaybeRef<Nullable<string>>
}

export function useMoveCategoryCard() {
  return useMutation({
    mutationKey: [...categoryKeys.all, 'move-card'],
    mutationFn: async ({ id, beforeId, afterId, newBoardId }: MoveCategoryCardVars) =>
      moveCategory({ id, beforeId, afterId, newBoardId }),

    onSuccess: async (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(boardId) })
    },
  })
}
