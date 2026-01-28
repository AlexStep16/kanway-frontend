import { updateAvatar } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export interface UpdateAvatarVars {
  data: FormData
}

export function useUpdateAvatar() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: (payload: UpdateAvatarVars) => updateAvatar(payload.data),
    onSuccess: (result) => {
      if (authStore.user) authStore.user.avatarUrl = result

      toast.success('Аватар успешно обновлен')
    },
  })
}
