import { undoOperation } from '~/services/log'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useUndo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => requestQueueService.enqueue(id, () => undoOperation(id)),

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: boardKeys.all }),
        queryClient.cancelQueries({ queryKey: columnKeys.all }),
        queryClient.cancelQueries({ queryKey: taskKeys.all }),
        queryClient.cancelQueries({ queryKey: workspaceKeys.all }),
      ])
    },

    onSuccess: async (result) => {
      invalidateUndo(result)

      toast.success('Операция успешно отменена')
    },
  })
}
