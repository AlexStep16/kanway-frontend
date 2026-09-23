import { deleteUser } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: userKeys.delete,
    mutationFn: () => deleteUser(),

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
