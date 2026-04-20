import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { register } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'

export function useRegister() {
  return useMutation({
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
