import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { settingKeys } from '@/keys'
import { ISingleUpdate } from '@/interfaces/domain/ISingleUpdate'
import { requestQueueService } from '@/utils/RequestQueueService'
import { ISetting } from '@/interfaces/domain/ISetting'
import { saveSetting } from '@/services/setting'

export interface UpdateSettingVars {
  payload: ISingleUpdate<ISetting>
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...settingKeys.all, 'update'],
    mutationFn: ({ payload }: UpdateSettingVars) =>
      requestQueueService.enqueue(payload.id, () => saveSetting(payload)),

    onMutate: async (vars) => {
      const queryKey = settingKeys.all

      await queryClient.cancelQueries({ queryKey })

      const previousSetting = queryClient.getQueryData<ISetting>(queryKey)

      if (previousSetting) {
        queryClient.setQueryData<ISetting>(queryKey, (old) => {
          if (!old) return undefined

          return { ...old, ...vars.payload }
        })
      }

      return { previousSetting, queryKey }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all })
    },

    onError: (err, vars, context) => {
      if (context?.previousSetting) {
        const originalSetting = context.previousSetting

        if (originalSetting) {
          queryClient.setQueryData<ISetting>(context.queryKey, (current) => {
            return current?.id === vars.payload.id ? originalSetting : current
          })
        }
      }
    },
  })
}
