import { register } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      errorMessage: false,
    },
    mutationFn: (credentials: { email: string; password: string }) =>
      register({
        ...credentials,
        timezone: dayjs.tz.guess(),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
