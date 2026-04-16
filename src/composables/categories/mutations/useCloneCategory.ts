import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { cloneCategory } from '@/services/category'
import { useUndo } from '@/composables/log/useUndo'

interface CloneCategoryVars {
  id: string
}

export function useCloneCategory() {
  const { mutate: undo } = useUndo()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'clone'],
    mutationFn: ({ id }: CloneCategoryVars) =>
      requestQueueService.enqueue(id, () => cloneCategory(id)),

    onSuccess: async (result) => {
      const newCategory = result.data[0]

      if (newCategory) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(newCategory.board.id) })
      }

      toast.success('Категория скопирована', {
        action: {
          label: 'Отменить',
          onClick: () => {
            if (result.logId) undo(result.logId)
          },
        },
      })
    },
  })
}
