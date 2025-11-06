import { Nullable } from '@/types/utils'

export interface IUser {
  id: string
  username?: string
  email: string
  role: string
  hasAvatar: boolean
  subscription: string
  subscriptionUntil?: Date
  generationsBalance: number
  avatarColor: string
  isTipsCompleted?: boolean
  paymentMethodId?: string
  yaId?: Nullable<string>
  createdAt: Date
  updatedAt: Date
}
