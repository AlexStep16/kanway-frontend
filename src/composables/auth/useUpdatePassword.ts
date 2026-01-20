import { updatePassword } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export interface UpdatePasswordVars {
  currentPassword: string
  password: string
}

export function useUpdatePassword() {
  return useMutation({
    mutationKey: ['user'],
    mutationFn: (data: UpdatePasswordVars) => updatePassword(data),
    onSuccess: () => {
      toast.success('Пароль успешно обновлен')
    },
  })
}
