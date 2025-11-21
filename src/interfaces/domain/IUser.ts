import { Nullable } from '@/types/utils'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'

export interface IUser {
  id: string
  username?: string
  email: string
  role: string
  avatarUrl?: string
  timezone: string
  subscriptionId: SubscriptionPlanEnum
  subscriptionUntil?: Date
  isSubscriptionActive?: boolean
  generationsCount: number
  avatarColor: string
  isTipsCompleted?: boolean
  paymentMethodId?: string
  yaId?: Nullable<string>
  createdAt: Date
  updatedAt: Date
}
