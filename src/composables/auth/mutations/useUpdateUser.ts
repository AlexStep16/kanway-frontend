import { useMutation } from '@tanstack/vue-query'
import { patchUserApi } from '@/api/auth'
import { requestQueueService } from '@utils/RequestQueueService'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import UserModel from '@/models/UserModel'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'

export function useUpdateUser() {
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
