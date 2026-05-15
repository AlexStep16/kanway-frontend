import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import { toast } from 'vue-sonner'
import type { ICategory } from '~/interfaces/domain/ICategory'
import { saveCategory } from '~/services/category'

interface MoveCategoryVars {
  payload: ISingleUpdate<ICategory>
  oldBoardId: string
  newBoardId: string
}

export function useMoveCategory() {
  const queryClient = useQueryClient()
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...categoryKeys.all, 'move'],
    mutationFn: ({ payload }: MoveCategoryVars) =>
      requestQueueService.enqueue(payload.id, () => saveCategory(payload)),
    onSuccess: async (result, { oldBoardId, newBoardId, payload }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(oldBoardId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.byBoard(newBoardId) })

      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(oldBoardId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.byBoard(newBoardId) })

      queryClient.invalidateQueries({ queryKey: categoryKeys.detailed(payload.id) })

      toast.success('Категория успешно перемещена', {
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
