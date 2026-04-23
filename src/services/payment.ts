import {
  buyCreditsApi,
  buySubscriptionApi,
  cancelSubscriptionApi,
  downgradeCancelSubscriptionApi,
  downgradeSubscriptionApi,
  resumeSubscriptionApi,
  upgradeSubscriptionApi,
} from '@/api/payments'
import { PaymentItemIdEnum } from '@/enums/PaymentItemIdEnum'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { IUser } from '@/interfaces/domain/IUser'
import { IBuySubscriptionResponse } from '@/interfaces/IBuySubscriptionResponse'

export async function buySubscription(
  subscriptionId: SubscriptionPlanEnum,
): Promise<IBuySubscriptionResponse> {
  return await buySubscriptionApi(subscriptionId)
}

export async function buyCredits(itemId: PaymentItemIdEnum): Promise<IBuySubscriptionResponse> {
  return await buyCreditsApi(itemId)
}

export async function upgradeSubscription(
  subscriptionId: SubscriptionPlanEnum,
): Promise<IBuySubscriptionResponse> {
  return await upgradeSubscriptionApi(subscriptionId)
}

export async function downgradeSubscription(subscriptionId: SubscriptionPlanEnum): Promise<IUser> {
  return await downgradeSubscriptionApi(subscriptionId)
}

export async function downgradeCancelSubscription(): Promise<IUser> {
  return await downgradeCancelSubscriptionApi()
}

export async function cancelSubscription() {
  return await cancelSubscriptionApi()
}

export async function resumeSubscription() {
  return await resumeSubscriptionApi()
}
