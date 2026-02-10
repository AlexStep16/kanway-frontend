import { apiCall } from '@/apiClient'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { IUser } from '@/interfaces/domain/IUser'
import { IBuySubscriptionResponse } from '@/interfaces/IBuySubscriptionResponse'

export async function buySubscriptionApi(subscriptionId: SubscriptionPlanEnum) {
  return await apiCall<IBuySubscriptionResponse>({
    method: 'POST',
    url: '/payments/buy',
    data: {
      subscriptionId,
    },
  })
}

export async function upgradeSubscriptionApi(subscriptionId: SubscriptionPlanEnum) {
  return await apiCall<IBuySubscriptionResponse>({
    method: 'POST',
    url: '/payments/upgrade',
    data: {
      subscriptionId,
    },
  })
}

export async function downgradeSubscriptionApi(subscriptionId: SubscriptionPlanEnum) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/payments/downgrade',
    data: {
      subscriptionId,
    },
  })
}

export async function downgradeCancelSubscriptionApi() {
  return await apiCall<IUser>({
    method: 'PATCH',
    url: '/payments/downgrade/cancel',
  })
}

export async function cancelSubscriptionApi() {
  return await apiCall<IUser>({
    method: 'PATCH',
    url: '/payments/cancel',
  })
}

export async function resumeSubscriptionApi() {
  return await apiCall<void>({
    method: 'PATCH',
    url: '/payments/resume',
  })
}
