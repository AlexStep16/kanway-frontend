import { FinishRegistrationDTO } from '@/interfaces/FinishRegistrationDTO'
import { userKeys } from '@/keys'
import { queryClient } from '@/plugins/queryClient'
import { finishSignup } from '@/services/auth'
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'

export function useFinishSignup() {
  return useMutation({
    mutationFn: (data: Omit<FinishRegistrationDTO, 'timezone'>) =>
      finishSignup({
        ...data,
        timezone: dayjs.tz.guess(),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })
    },
  })
}
