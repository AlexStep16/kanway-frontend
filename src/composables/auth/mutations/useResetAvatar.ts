import { resetAvatar } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export function useResetAvatar() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: ['user'],
    onMutate: () => {
      const oldAvatarUrl = authStore.user?.avatarUrl

      if (authStore.user) authStore.user.avatarUrl = undefined

      return { oldAvatarUrl }
    },
    mutationFn: () => resetAvatar(),
    onSuccess: () => {
      toast.success('Аватар успешно удален')
    },

    onError: (err, vars, context) => {
      if (context?.oldAvatarUrl && authStore.user) {
        authStore.user.avatarUrl = context.oldAvatarUrl
      }
    },
  })
}
