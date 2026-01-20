import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { workspaceKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { cloneWorkspace } from '@services/workspace'
import { useUndo } from '@/composables/useUndo'

interface CloneWorkspaceVars {
  id: string
}

export function useCloneWorkspace() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'clone'],
    mutationFn: ({ id }: CloneWorkspaceVars) =>
      requestQueueService.enqueue(id, () => cloneWorkspace(id)),

    onSuccess: async (result) => {
      toast.success('Пространство скопировано', {
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
