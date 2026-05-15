import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { requestQueueService } from '~/utils/RequestQueueService'
import type { IChat } from '~/interfaces/domain/IChat'
import { removeChat } from '~/services/chat'
import { useChatStore } from '~/stores/chat'

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
      const chatKey = chatKeys.byWorkspace(workspaceId)

      await queryClient.cancelQueries({ queryKey: chatKey })

      const previousChats = queryClient.getQueryData<IChat[]>(chatKey)

      if (previousChats) {
        queryClient.setQueryData<IChat[]>(chatKey, (oldChats) =>
          oldChats ? oldChats.filter((c) => c.id !== id) : [],
        )
      }

      return { previousChats, chatKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousChats) {
        const chatToRestore = context.previousChats.find((c) => c.id === vars.id)

        if (chatToRestore) {
          queryClient.setQueryData<IChat[]>(context.chatKey, (current) => {
            if (current?.some((c) => c.id === vars.id)) return current

            return [chatToRestore, ...(current || [])]
          })
        }
      }
    },

    onSettled: (data, error, vars) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.byWorkspace(vars.workspaceId) })
    },

    onSuccess: (result, { id }) => {
      const chatStore = useChatStore()

      toast.success('Чат успешно удален')

      if (chatStore.activeChatId === id) {
        chatStore.closeChat()
      }
    },
  })
}
