import { deleteUser } from '~/services/auth'
import { useMutation } from '@tanstack/vue-query'

export function useDeleteUser() {
  return useMutation({
    mutationKey: ['user', 'delete'],
    mutationFn: () => deleteUser(),

    onSuccess: () => {
      navigateTo('/auth')
    },
  })
}
