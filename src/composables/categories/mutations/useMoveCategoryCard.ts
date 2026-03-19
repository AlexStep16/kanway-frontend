import { useMutation } from '@tanstack/vue-query'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { Nullable } from '@/types/utils'
import { moveCategory } from '@/services/category'
import { MaybeRef } from 'node_modules/@tanstack/vue-query/build/modern/types'

export interface MoveCategoryCardVars {
  id: string
  beforeCategoryId?: Nullable<string>
  afterCategoryId?: Nullable<string>
  newBoardId?: string
  boardId: MaybeRef<Nullable<string>>
}

export function useMoveCategoryCard() {
  return useMutation({
    mutationKey: [...categoryKeys.all, 'move-card'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({
      id,
      beforeCategoryId,
      afterCategoryId,
      newBoardId,
    }: MoveCategoryCardVars) => moveCategory({ id, beforeCategoryId, afterCategoryId, newBoardId }),

    onSuccess: async (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(boardId) })
    },
  })
}
