import { Nullable } from '@/types/utils'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { AvailableColors } from '@/enums/AvailableColors'

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
  avatarColor: AvailableColors
  isTipsCompleted?: boolean
  paymentMethodId?: string
  pendingChangePlan?: Nullable<SubscriptionPlanEnum>
  yaId?: Nullable<string>
  createdAt: Date
  updatedAt: Date
}
