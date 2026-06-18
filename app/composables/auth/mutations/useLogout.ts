import { logout } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: () => logout(),
    onSuccess: () => {
      navigateTo('/auth')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
