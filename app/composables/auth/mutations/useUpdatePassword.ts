import { updatePassword } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export interface UpdatePasswordVars {
  currentPassword: string
  password: string
}

export function useUpdatePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user'],
    mutationFn: (data: UpdatePasswordVars) => updatePassword(data),
    onSuccess: () => {
      toast.success('Пароль успешно обновлен')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
