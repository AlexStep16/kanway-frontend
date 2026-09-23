import type { FinishRegistrationDTO } from '~/interfaces/FinishRegistrationDTO'
import { finishSignup } from '~/services/auth'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'

export function useFinishSignup() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      errorMessage: false,
    },
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
