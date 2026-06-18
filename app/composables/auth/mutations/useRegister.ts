import { register } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      register({
        ...credentials,
        timezone: dayjs.tz.guess(),
      }),
    onSuccess: () => {
      navigateTo('/workspace')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
