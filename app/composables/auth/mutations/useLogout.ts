import { logout } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.setQueryData(userKeys.me, null)

      await router.push('/auth')

      queryClient.clear()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me })
    },
  })
}
