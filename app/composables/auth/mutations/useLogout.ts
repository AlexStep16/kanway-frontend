import { logout } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: async (isRedirectToAuth: boolean) => {
      await logout()
      return { isRedirectToAuth }
    },
    onSuccess: async (vars: { isRedirectToAuth: boolean }) => {
      queryClient.setQueryData(userKeys.me, null)

      localStorage.removeItem('activeWorkspaceId')
      localStorage.removeItem('activeBoardId')
      localStorage.removeItem('selectedChatId')
      localStorage.removeItem('selectedChatWorkspaceId')
      localStorage.removeItem('chatIsOpen')

      if (vars.isRedirectToAuth) {
        await router.push('/auth')
      }

      queryClient.clear()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
