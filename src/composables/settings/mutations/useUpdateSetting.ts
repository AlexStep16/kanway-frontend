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

      const previousSettings = queryClient.getQueryData<ISetting[]>(queryKey)

      if (previousSettings) {
        queryClient.setQueryData<ISetting[]>(queryKey, (old) => {
          if (!old) return []
          return old.map((t) => (t.id === vars.payload.id ? { ...t, ...vars.payload } : t))
        })
      }

      return { previousSettings, queryKey }
    },

    onError: (err, vars, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(context.queryKey, context.previousSettings)
      }
    },
  })
}
