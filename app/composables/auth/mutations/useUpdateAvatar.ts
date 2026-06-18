import { updateAvatar } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export interface UpdateAvatarVars {
  data: FormData
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: (payload: UpdateAvatarVars) => updateAvatar(payload.data),
    onSuccess: () => {
      toast.success('Аватар успешно обновлен')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
