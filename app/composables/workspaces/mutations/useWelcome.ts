import { useMutation } from '@tanstack/vue-query'
import { welcome } from '~/services/workspace'
import type { WelcomePayload } from '~/interfaces/WelcomePayload'

export function useWelcome() {
  return useMutation({
    mutationKey: [...workspaceKeys.all, 'welcome'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ payload }: { payload: WelcomePayload }) => welcome(payload),
  })
}
