import { updatePassword } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export interface UpdatePasswordVars {
  currentPassword: string
  password: string
}

export function useUpdatePassword() {
  const authStore = useAuthStore()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: (data: UpdatePasswordVars) => updatePassword(data),
    onSuccess: (result) => {
      authStore.setUser(result)
      toast.success('Пароль успешно обновлен')
    },
  })
}
