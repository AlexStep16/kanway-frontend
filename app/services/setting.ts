import SettingModel from '~/models/SettingModel'
import type { ISetting } from '~/interfaces/domain/ISetting'

export function transformSetting(raw: ISetting): SettingModel {
  const setting = new SettingModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return setting
}

export async function fetchSetting(): Promise<SettingModel> {
  const settings = await getSettingApi()

  return transformSetting(settings[0]!)
}

export async function saveSetting(payload: Partial<ISetting>): Promise<ISetting> {
  const updatedSettings = await patchSettingApi(payload)

  return transformSetting(updatedSettings[0]!)
}

export async function fetchSubscriptions() {
  const subscriptions = await getSubscriptionsApi()

  return subscriptions
}

export async function fetchPayments() {
  const payments = await getPaymentsApi()

  return payments
}

export async function fetchPaymentMethods() {
  const paymentMethods = await getPaymentMethodsApi()

  return paymentMethods
}

export async function deletePaymentMethod(id: string): Promise<void> {
  await deletePaymentMethodApi(id)
}
