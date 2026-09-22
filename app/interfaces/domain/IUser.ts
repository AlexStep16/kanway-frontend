import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { AvailableColors } from '~/enums/AvailableColors'

export interface IUser {
  id: string
  username?: string
  email: string
  role: string
  hasPassword: boolean
  avatarUrl?: string
  timezone: string
  isConfirmed: boolean
  isDeleted: boolean
  deletedTime?: Date | null
  subscriptionId: SubscriptionPlanEnum
  subscriptionUntil?: Date
  isSubscriptionActive?: boolean
  isAutoRenewEnabled?: boolean
  credits: number
  paidCredits: number
  avatarColor: AvailableColors
  isTipsCompleted?: boolean
  yandexUserId?: string
  vkUserId?: string
  paymentMethodId?: string
  pendingChangePlan?: SubscriptionPlanEnum | null
  yaId?: string | null
  createdAt: Date
  updatedAt: Date
}
