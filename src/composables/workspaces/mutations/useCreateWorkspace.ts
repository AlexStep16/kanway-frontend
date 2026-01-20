import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { workspaceKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { IWorkspace } from '@interfaces/domain/IWorkspace'
import { createWorkspace } from '@services/workspace'
import { useWorkspaceStore } from '@stores/workspace'
import { useUndo } from '@/composables/useUndo'

interface CreateWorkspaceVars {
  payload: Partial<IWorkspace>
}

export function useCreateWorkspace() {
  const { mutate: undo } = useUndo()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'create'],
    mutationFn: async ({ payload }: CreateWorkspaceVars) => {
      if (!payload) {
        throw new Error('Недостаточно данных для создания пространства')
      }

      return createWorkspace(payload)
    },

    onSuccess: async (result) => {
      const WORKSPACE_STORE = useWorkspaceStore()
      const workspaces = queryClient.getQueryData<IWorkspace[]>(workspaceKeys.lists())
      const nextWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null

      if (nextWorkspace) WORKSPACE_STORE.selectWorkspace(nextWorkspace, true)

      if (result.data.length === 0) {
        return toast.error('Произошла ошибка при создании пространства')
      }

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
