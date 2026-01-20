import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { categoryKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { cloneCategory } from '@/services/category'
import { useUndo } from '@/composables/useUndo'

interface CloneCategoryVars {
  id: string
}

export function useCloneCategory() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'clone'],
    mutationFn: ({ id }: CloneCategoryVars) =>
      requestQueueService.enqueue(id, () => cloneCategory(id)),

    onSuccess: async (result) => {
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
