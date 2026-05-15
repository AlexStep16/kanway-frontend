import type { IUser } from '~/interfaces/domain/IUser'
import { resetAvatar } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useResetAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    onMutate: () => {
      const user = queryClient.getQueryData<IUser>(userKeys.me)

      const oldAvatarUrl = user?.avatarUrl

      if (user) queryClient.setQueryData(userKeys.me, { ...user, avatarUrl: undefined })

      return { oldAvatarUrl }
    },
    mutationFn: () => resetAvatar(),
    onSuccess: () => {
      toast.success('Аватар успешно удален')
    },

    onError: (err, vars, context) => {
      const user = queryClient.getQueryData<IUser>(userKeys.me)

      if (context?.oldAvatarUrl && user) {
        queryClient.setQueryData(userKeys.me, { ...user, avatarUrl: context.oldAvatarUrl })
      }
    },
  })
}
