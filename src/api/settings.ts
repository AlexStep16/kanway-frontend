import { apiCall } from '@/apiClient'
import { ISetting } from '@interfaces/domain/ISetting'

export async function getSettingApi() {
  return await apiCall<ISetting>({
    method: 'GET',
    url: '/settings',
  })
}

export async function patchSettingApi(payload: Partial<ISetting>) {
  return apiCall<ISetting>({
    method: 'PATCH',
    url: '/settings',
    data: payload,
  })
}
