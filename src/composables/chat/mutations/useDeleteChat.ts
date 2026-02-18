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
        const chatToRestore = context.previousChats.find((c) => c.id === vars.id)

        if (chatToRestore) {
          queryClient.setQueryData<IChat[]>(context.categoryKey, (current) => {
            if (current?.some((c) => c.id === vars.id)) return current

            return [chatToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: (data, error, vars, context) => {
      const categoryKey = chatKeys.byWorkspace(vars.workspaceId)

      queryClient.invalidateQueries({ queryKey: categoryKey })
    },

    onSuccess: (result, { workspaceId }) => {
      toast.success('Чат успешно удален')
    },
  })
}
