import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { requestQueueService } from '~/utils/RequestQueueService'
import type { IChatEditPayload } from '~/interfaces/IChatEditPayload'
import { updateChat } from '~/services/chat'
import type { IChat } from '~/interfaces/domain/IChat'

export interface UpdateChatVars {
  payload: IChatEditPayload
  id: string
}

export function useUpdateChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...chatKeys.all, 'update'],
    mutationFn: ({ payload, id }: UpdateChatVars) =>
      requestQueueService.enqueue(id, () => updateChat(payload, id)),

    onMutate: async (vars) => {
      const queryKey = chatKeys.detailed(vars.id)

      await queryClient.cancelQueries({ queryKey })

      const previousChat = queryClient.getQueryData<IChat>(queryKey)

      if (previousChat) {
        queryClient.setQueryData<IChat>(queryKey, (old) => {
          if (!old) return old
          return { ...old, ...vars.payload }
        })
      }

      return { previousChat, queryKey }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
    },

    onError: (err, vars, context) => {
      if (context?.previousChat) {
        const originalChat = context.previousChat

        if (originalChat) {
          queryClient.setQueryData<IChat>(context.queryKey, originalChat)
        }
      }
    },
  })
}
