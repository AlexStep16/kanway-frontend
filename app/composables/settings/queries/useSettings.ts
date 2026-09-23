import { useQuery } from '@tanstack/vue-query'
import { fetchSetting } from '~/services/setting'

export function useSetting() {
  return useQuery({
    queryKey: settingKeys.all,
    queryFn: () => fetchSetting(),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
