import { Nullable } from '@/types/utils'
import { IUser } from '@interfaces/domain/IUser'

export default class UserModel implements IUser {
  public id: string
  public username?: string
  public email: string
  public role: string
  public avatarUrl?: string
  public timezone: string
  public subscriptionId: string
  public subscriptionUntil?: Date
  public generationsBalance: number
  public avatarColor: string
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
    this.subscriptionId = props.subscriptionId
    this.generationsBalance = props.generationsBalance
    this.avatarColor = props.avatarColor
    this.paymentMethodId = props.paymentMethodId
    this.yaId = props.yaId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.subscriptionUntil = props.subscriptionUntil
    this.isTipsCompleted = props.isTipsCompleted
  }
}
