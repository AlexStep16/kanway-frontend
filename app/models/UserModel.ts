import type { IUser } from '~/interfaces/domain/IUser'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { AvailableColors } from '~/enums/AvailableColors'

export default class UserModel implements IUser {
  public id: string
  public username?: string
  public email: string
  public role: string
  public hasPassword: boolean
  public avatarUrl?: string
  public timezone: string
  public isConfirmed: boolean
  public subscriptionId: SubscriptionPlanEnum
  public subscriptionUntil?: Date
  public isSubscriptionActive?: boolean
  public audioCreditsSpent: number
  public credits: number
  public paidCredits: number
  public avatarColor: AvailableColors
  public isTipsCompleted?: boolean
  public yandexClientId?: string
  public vkClientId?: string
  public paymentMethodId?: string
  public pendingChangePlan?: SubscriptionPlanEnum | null
  public yaId?: string | null
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IUser) {
    this.id = props.id
    this.username = props.username
    this.email = props.email
    this.role = props.role
    this.hasPassword = props.hasPassword
    this.avatarUrl = props.avatarUrl
    this.timezone = props.timezone
    this.isConfirmed = props.isConfirmed
    this.subscriptionId = props.subscriptionId
    this.subscriptionUntil = props.subscriptionUntil
    this.isSubscriptionActive = props.isSubscriptionActive
    this.audioCreditsSpent = props.audioCreditsSpent
    this.credits = props.credits
    this.paidCredits = props.paidCredits
    this.avatarColor = props.avatarColor
    this.yandexClientId = props.yandexClientId
    this.vkClientId = props.vkClientId
    this.paymentMethodId = props.paymentMethodId
    this.pendingChangePlan = props.pendingChangePlan
    this.yaId = props.yaId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.isTipsCompleted = props.isTipsCompleted
  }
}
