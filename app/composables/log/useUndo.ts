import { undoOperation } from '~/services/log'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useUndo() {
  return useMutation({
    mutationFn: (id: string) => requestQueueService.enqueue(id, () => undoOperation(id)),
    onSuccess: async (result) => {
      invalidateUndo(result)

      toast.success('Операция успешно отменена')
    },
  })
}
