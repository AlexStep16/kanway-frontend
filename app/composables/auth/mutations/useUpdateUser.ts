import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ISingleUpdate } from '~/interfaces/domain/ISingleUpdate'
import UserModel from '~/models/UserModel'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],

    mutationFn: (payload: ISingleUpdate<UserModel>) =>
      requestQueueService.enqueue(payload.id, () => patchUserApi(payload)),

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
