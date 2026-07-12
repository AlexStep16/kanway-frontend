import { PaymentItemIdEnum } from '~/enums/PaymentItemIdEnum'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import type { IPayment } from '~/interfaces/domain/IPayment'
import type { IUser } from '~/interfaces/domain/IUser'
import type { IBuySubscriptionResponse } from '~/interfaces/IBuySubscriptionResponse'

export async function getPaymentByIdApi(paymentId: string) {
  return await apiCall<IPayment>({
    method: 'GET',
    url: `/payments/${paymentId}`,
  })
}

export async function getPaymentStatus(serviceId: string) {
  return await apiCall<IPayment>({
    method: 'GET',
    url: `/payments/${serviceId}/status`,
  })
}

export async function buySubscriptionApi(subscriptionId: SubscriptionPlanEnum) {
  return await apiCall<IBuySubscriptionResponse>({
    method: 'POST',
    url: '/payments/buy-subscription',
    data: {
      subscriptionId,
    },
  })
}

export async function buyCreditsApi(itemId: PaymentItemIdEnum) {
  return await apiCall<IBuySubscriptionResponse>({
    method: 'POST',
    url: '/payments/buy-credits',
    data: {
      itemId,
    },
  })
}

export async function upgradeSubscriptionApi(subscriptionId: SubscriptionPlanEnum) {
  return await apiCall<IBuySubscriptionResponse>({
    method: 'POST',
    url: '/payments/upgrade-subscription',
    data: {
      subscriptionId,
    },
  })
}

export async function downgradeSubscriptionApi(subscriptionId: SubscriptionPlanEnum) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/payments/downgrade-subscription',
    data: {
      subscriptionId,
    },
  })
}

export async function downgradeCancelSubscriptionApi() {
  return await apiCall<IUser>({
    method: 'PATCH',
    url: '/payments/downgrade-subscription/cancel',
  })
}

export async function cancelSubscriptionApi() {
  return await apiCall<IUser>({
    method: 'PATCH',
    url: '/payments/cancel-subscription',
  })
}

export async function resumeSubscriptionApi() {
  return await apiCall<void>({
    method: 'PATCH',
    url: '/payments/resume-subscription',
  })
}

export async function tryAgainApi(paymentId: string) {
  return await apiCall<IBuySubscriptionResponse>({
    method: 'POST',
    url: `/payments/try-again`,
    data: {
      paymentId,
    },
  })
}
