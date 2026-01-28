import { invalidateUndo } from '@/helpers/invalidateUndo'
import { undoOperation } from '@services/log'
import { useMutation } from '@tanstack/vue-query'
import { requestQueueService } from '@utils/RequestQueueService'
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
