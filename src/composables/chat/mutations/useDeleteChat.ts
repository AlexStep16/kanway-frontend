import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { chatKeys } from '@/keys'
import { requestQueueService } from '@/utils/RequestQueueService'
import { IChat } from '@/interfaces/domain/IChat'
import { removeChat } from '@/services/chat'

interface DeleteChatVars {
  id: string
  workspaceId: string | null
}

export function useDeleteChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'delete'],
    mutationFn: ({ id }: DeleteChatVars) => requestQueueService.enqueue(id, () => removeChat(id)),
    onMutate: async ({ id, workspaceId }) => {
      const categoryKey = chatKeys.byWorkspace(workspaceId)

      await queryClient.cancelQueries({ queryKey: categoryKey })

      const previousChats = queryClient.getQueryData<IChat[]>(categoryKey)

      if (previousChats) {
        queryClient.setQueryData<IChat[]>(categoryKey, (oldChats) =>
          oldChats ? oldChats.filter((c) => c.id !== id) : [],
        )
      }

      return { previousChats, categoryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(context.categoryKey, context.previousChats)
      }
    },

    onSuccess: (result, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(workspaceId) })

      toast.success('Чат успешно удален')
    },
  })
}
