import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { createWorkspace } from '@services/workspace'
import { useWorkspaceStore } from '@stores/workspace'
import { useUndo } from '@/composables/logs/useUndo'

interface CreateWorkspaceVars {
  payload: Partial<IWorkspace>
}

export function useCreateWorkspace() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'create'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ payload }: CreateWorkspaceVars) => {
      if (!payload) {
        throw new Error('Недостаточно данных для создания пространства')
      }

      return createWorkspace(payload)
    },

    onSuccess: async (result) => {
      const WORKSPACE_STORE = useWorkspaceStore()

      queryClient.setQueryData(workspaceKeys.lists(), (oldWorkspaces: IWorkspace[] | undefined) => {
        return oldWorkspaces ? [...oldWorkspaces, ...result.data] : result.data
      })

      if (result.data && result.data.length > 0)
        WORKSPACE_STORE.selectWorkspace(result.data[0], true)

      toast.success('Пространство успешно создано', {
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
