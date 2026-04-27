import { useMutation } from '@tanstack/vue-query'
import { workspaceKeys } from '@/keys'
import { welcome } from '@services/workspace'
import { WelcomePayload } from '@/interfaces/WelcomePayload'

export function useWelcome() {
  return useMutation({
    mutationKey: [...workspaceKeys.all, 'welcome'],
    meta: {
      keysToInvalidate: [workspaceKeys.lists()],
    },
    mutationFn: async ({ payload }: { payload: WelcomePayload }) => welcome(payload),
  })
}
