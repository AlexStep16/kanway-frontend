import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ICategoryState } from '@/stores/interfaces/ICategoryState'
import { recoverCategory } from '@/services/category'
import { useUndo } from '@/composables/useUndo'

interface RecoverCategoryVars {
  category: ICategoryState
}

export function useRecoverCategory() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'recover'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists(), categoryKeys.archived()],
    },
    mutationFn: ({ category }: RecoverCategoryVars) =>
      requestQueueService.enqueue(category.id, () => recoverCategory(category.id)),

    onMutate: async ({ category }) => {
      const actualCategoriesKey = categoryKeys.byBoard(category.board.id)
      const archivedCategoriesKey = categoryKeys.archived()

      await queryClient.cancelQueries({ queryKey: actualCategoriesKey })
      await queryClient.cancelQueries({ queryKey: archivedCategoriesKey })

      const prevArchived = queryClient.getQueryData<ICategoryState[]>(archivedCategoriesKey)
      const prevCategories = queryClient.getQueryData<ICategoryState[]>(actualCategoriesKey)

      if (prevArchived) {
        queryClient.setQueryData<ICategoryState[]>(archivedCategoriesKey, (old) =>
          old ? old.filter((c) => c.id !== category.id) : [],
        )
      }

      if (prevCategories) {
        queryClient.setQueryData<ICategoryState[]>(actualCategoriesKey, (old) =>
          old ? [...old, { ...category, isDeleted: false }] : [{ ...category, isDeleted: false }],
        )
      }

      return { prevArchived, prevCategories, archivedCategoriesKey, actualCategoriesKey }
    },

    onError: (err, vars, context) => {
      if (context?.actualCategoriesKey) {
        queryClient.setQueryData<ICategoryState[]>(context.actualCategoriesKey, (current) => {
          return current?.filter((c) => c.id !== vars.category.id) || []
        })
      }

      if (context?.prevArchived) {
        const categoryToRestore = context.prevArchived.find((c) => c.id === vars.category.id)

        if (categoryToRestore) {
          queryClient.setQueryData<ICategoryState[]>(context.archivedCategoriesKey, (current) => {
            if (current?.some((c) => c.id === vars.category.id)) return current
            return [categoryToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: (result, error, { category }) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.byWorkspace(category.workspace.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(category.board.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(category.board.id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(category.id) })
    },

    onSuccess: (result) => {
      toast.success('Категория восстановлена', {
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
