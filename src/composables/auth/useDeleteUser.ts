import { deleteUser } from '@/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'delete'],
    mutationFn: () => deleteUser(),

    onSuccess: () => {
      queryClient.clear()
    },
  })
}
