import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { AvailableColors } from '~/enums/AvailableColors'

export interface IUser {
  id: string
  username?: string
  email: string
  role: string
  avatarUrl?: string
  timezone: string
  isConfirmed: boolean
  subscriptionId: SubscriptionPlanEnum
  subscriptionUntil?: Date
  isSubscriptionActive?: boolean
  credits: number
  paidCredits: number
  avatarColor: AvailableColors
  audioCreditsSpent: number
  isTipsCompleted?: boolean
  paymentMethodId?: string
  pendingChangePlan?: SubscriptionPlanEnum | null
  yaId?: string | null
  createdAt: Date
  updatedAt: Date
}
