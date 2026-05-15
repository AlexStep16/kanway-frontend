import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { cloneWorkspace } from '~/services/workspace'

interface CloneWorkspaceVars {
  id: string
}

export function useCloneWorkspace() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'clone'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
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
