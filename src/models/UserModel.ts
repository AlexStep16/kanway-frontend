import { Nullable } from '@/types/utils'
import { IUser } from '@interfaces/domain/IUser'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { AvailableColors } from '@/enums/AvailableColors'

export default class UserModel implements IUser {
  public id: string
  public username?: string
  public email: string
  public role: string
  public avatarUrl?: string
  public timezone: string
  public isConfirmed: boolean
  public subscriptionId: SubscriptionPlanEnum
  public subscriptionUntil?: Date
  public isSubscriptionActive?: boolean
  public generationsCount: number
  public avatarColor: AvailableColors
  public isTipsCompleted?: boolean
  public paymentMethodId?: string
  public yaId?: Nullable<string>
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IUser) {
    this.id = props.id
    this.username = props.username
    this.email = props.email
    this.role = props.role
    this.avatarUrl = props.avatarUrl
    this.timezone = props.timezone
    this.isConfirmed = props.isConfirmed
    this.subscriptionId = props.subscriptionId
    this.subscriptionUntil = props.subscriptionUntil
    this.isSubscriptionActive = props.isSubscriptionActive
    this.generationsCount = props.generationsCount
    this.avatarColor = props.avatarColor
    this.paymentMethodId = props.paymentMethodId
    this.yaId = props.yaId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.isTipsCompleted = props.isTipsCompleted
  }
}
