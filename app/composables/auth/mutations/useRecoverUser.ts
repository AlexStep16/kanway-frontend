import { updateUser } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useRecoverUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: userKeys.recover,
    mutationFn: () =>
      updateUser({
        isDeleted: false,
        deletedTime: null,
      }),

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
