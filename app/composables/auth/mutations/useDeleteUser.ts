import { deleteUser } from '~/services/auth'
import { useAuthStore } from '~/stores/auth'
import { useMutation } from '@tanstack/vue-query'

export function useDeleteUser() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: ['user', 'delete'],
    mutationFn: () => deleteUser(),

    onSuccess: () => {
      authStore.logout()
    },
  })
}
