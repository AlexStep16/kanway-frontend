import { logout } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const queryClient = useQueryClient()
  const route = useRoute() // Получаем текущий роут

  return useMutation({
    mutationKey: ['user'],
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.resetQueries()

      if (route.meta.authOnly) {
        navigateTo('/auth')
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
