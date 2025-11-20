import { getSettingApi, patchSettingApi } from '@api/settings'
import SettingModel from '@/models/SettingModel'
import { ISetting } from '@/interfaces/domain/ISetting'

export function transformSetting(raw: ISetting): SettingModel {
  const setting = new SettingModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return setting
}

export async function fetchSetting(): Promise<SettingModel> {
  const setting = await getSettingApi()

  return transformSetting(setting)
}

export async function updateSetting(payload: Partial<ISetting>): Promise<ISetting> {
  const updatedSetting = await patchSettingApi(payload)

  return transformSetting(updatedSetting)
}
