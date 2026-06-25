import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { welcome } from '~/services/workspace'
import type { WelcomePayload } from '~/interfaces/WelcomePayload'

export function useWelcome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...workspaceKeys.all, 'welcome'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ payload }: { payload: WelcomePayload }) => welcome(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
