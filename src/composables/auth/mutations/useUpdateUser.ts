import { useMutation } from '@tanstack/vue-query'
import { patchUserApi } from '@/api/auth'
import { requestQueueService } from '@utils/RequestQueueService'
import { useAuthStore } from '@/stores/auth'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import UserModel from '@/models/UserModel'

export function useUpdateUser() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: ['user'],

    mutationFn: (payload: ISingleUpdate<UserModel>) =>
      requestQueueService.enqueue(payload.id, () => patchUserApi(payload)),

    onSuccess: (updatedUser) => {
      authStore.setUser(updatedUser)
    },
  })
}
