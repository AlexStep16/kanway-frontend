import { apiCall } from '@/apiClient'
import { ISubscription } from '@/interfaces/domain/ISubscription'
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

export async function getSubscriptionsApi() {
  return await apiCall<ISubscription[]>({
    method: 'GET',
    url: '/subscriptions',
  })
}

export async function getPaymentsApi() {
  return await apiCall<any[]>({
    method: 'GET',
    url: '/payments',
  })
}

export async function getPaymentMethodsApi() {
  return await apiCall<any[]>({
    method: 'GET',
    url: '/payment-methods',
  })
}

export async function deletePaymentMethodApi(id: string) {
  return await apiCall<void>({
    method: 'DELETE',
    url: `/payment-methods/${id}`,
  })
}
