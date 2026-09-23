import dayjs from 'dayjs'
import { PaymentItemIdEnum } from '~/enums/PaymentItemIdEnum'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import type { IPayment } from '~/interfaces/domain/IPayment'
import type { IUser } from '~/interfaces/domain/IUser'
import type { IBuySubscriptionResponse } from '~/interfaces/IBuySubscriptionResponse'

export function transformPayment(raw: IPayment): IPayment {
  const { $queryClient } = useNuxtApp()

  const user = $queryClient.getQueryData<IUser>(userKeys.me)

  const timezone = user?.timezone || dayjs.tz.guess()

  const payment = {
    ...raw,
    createdAt: dayjs.utc(raw.createdAt).tz(timezone).toDate(),
    updatedAt: dayjs.utc(raw.updatedAt).tz(timezone).toDate(),
  }

  return payment
}

export async function fetchPayment(paymentId: string): Promise<IPayment> {
  const rawPayment = await getPaymentByIdApi(paymentId)

  return transformPayment(rawPayment)
}

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

export async function tryAgain(paymentId: string) {
  return await tryAgainApi(paymentId)
}
