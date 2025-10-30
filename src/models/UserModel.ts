interface User {
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
  yaId?: string | null
  createdAt: Date
  updatedAt: Date
}

export default class UserModel {
  public id: string
  public username?: string
  public email: string
  public role: string
  public hasAvatar: boolean
  public subscription: string
  public subscriptionUntil?: Date
  public generationsBalance: number
  public avatarColor: string
  public isTipsCompleted?: boolean
  public paymentMethodId?: string
  public yaId?: string | null
  public createdAt: Date
  public updatedAt: Date

  constructor(props: User) {
    this.id = props.id
    this.username = props.username
    this.email = props.email
    this.role = props.role
    this.hasAvatar = props.hasAvatar
    this.subscription = props.subscription
    this.generationsBalance = props.generationsBalance
    this.avatarColor = props.avatarColor
    this.paymentMethodId = props.paymentMethodId
    this.yaId = props.yaId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt

    if (props.subscriptionUntil) {
      this.subscriptionUntil = props.subscriptionUntil
    }

    if (props.isTipsCompleted) {
      this.isTipsCompleted = props.isTipsCompleted
    }
  }
}
