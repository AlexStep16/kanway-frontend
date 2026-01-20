import { boardKeys, categoryKeys, taskKeys, workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { undoOperation } from '@services/log'
import { useMutation } from '@tanstack/vue-query'
import { requestQueueService } from '@utils/RequestQueueService'
import { toast } from 'vue-sonner'

export function useUndo() {
  return useMutation({
    mutationFn: (id: string) => requestQueueService.enqueue(id, () => undoOperation(id)),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
        queryClient.invalidateQueries({ queryKey: boardKeys.all }),
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
        queryClient.invalidateQueries({ queryKey: taskKeys.all }),
      ])

      toast.success('Операция успешно отменена')
    },
  })
}
