import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { categoryKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { archiveCategory } from '@/services/category'
import { useUndo } from '@/composables/useUndo'

interface ArchiveCategoryVars {
  category: ICategoryState
}

export function useArchiveCategory() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'archive'],
    mutationFn: ({ category }: ArchiveCategoryVars) =>
      requestQueueService.enqueue(category.id, () => archiveCategory(category.id)),
    onMutate: async ({ category }) => {
      const queryKey = categoryKeys.byBoard(category.board.id)

      await queryClient.cancelQueries({ queryKey })

      const previousCategories = queryClient.getQueryData<ICategoryState[]>(queryKey)

      if (previousCategories) {
        queryClient.setQueryData<ICategoryState[]>(queryKey, (old) =>
          old ? old.filter((c) => c.id !== category.id) : [],
        )
      }

      return { previousCategories, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(context.queryKey, context.previousCategories)
      }
    },

    onSuccess: (result) => {
      toast.success('Категория архивирована', {
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
