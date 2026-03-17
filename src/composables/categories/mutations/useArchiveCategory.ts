import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { archiveCategory } from '@/services/category'
import { useUndo } from '@/composables/logs/useUndo'

interface ArchiveCategoryVars {
  category: ICategoryState
}

export function useArchiveCategory() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'archive'],
    meta: {
      keysToInvalidate: [categoryKeys.archived(), workspaceKeys.lists()],
    },
    mutationFn: ({ category }: ArchiveCategoryVars) =>
      requestQueueService.enqueue(category.id, () => archiveCategory(category.id)),
    onMutate: async ({ category }) => {
      const actualCategoriesKey = categoryKeys.byBoard(category.board.id)
      const archivedCategoriesKey = categoryKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualCategoriesKey })
      await queryClient.cancelQueries({ queryKey: archivedCategoriesKey })

      const prevCategories = queryClient.getQueryData<ICategoryState[]>(actualCategoriesKey)
      const prevArchived = queryClient.getQueryData<ICategoryState[]>(archivedCategoriesKey)

      if (prevCategories) {
        queryClient.setQueryData<ICategoryState[]>(actualCategoriesKey, (old) =>
          old ? old.filter((c) => c.id !== category.id) : [],
        )
      }

      if (prevArchived) {
        queryClient.setQueryData<ICategoryState[]>(archivedCategoriesKey, (old) =>
          old ? [...old, { ...category, isDeleted: true }] : [{ ...category, isDeleted: true }],
        )
      }

      return { prevArchived, prevCategories, archivedCategoriesKey, actualCategoriesKey }
    },

    onError: (err, vars, context) => {
      if (context?.prevCategories) {
        const categoryToRestore = context.prevCategories.find((c) => c.id === vars.category.id)

        if (categoryToRestore) {
          queryClient.setQueryData<ICategoryState[]>(context.actualCategoriesKey, (current) => {
            if (current?.some((c) => c.id === vars.category.id)) return current
            return [categoryToRestore, ...(current || [])]
          })
        }
      }

      if (context?.archivedCategoriesKey) {
        queryClient.setQueryData<ICategoryState[]>(context.archivedCategoriesKey, (current) => {
          return current?.filter((c) => c.id !== vars.category.id) || []
        })
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

    onSettled: (data, error, { category }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(category.id) })
    },
  })
}
