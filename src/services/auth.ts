import LoginCredentials from '@interfaces/LoginCredentials'
import { loginApi } from '@api/auth'
import UserRaw from '@interfaces/UserRaw'
import UserModel from '@/models/UserModel'

export function transformUser(raw: UserRaw): UserModel {
  const user = new UserModel({
    id: raw._id,
    email: raw.email,
    username: raw.username,
    role: raw.role,
    hasAvatar: raw.hasAvatar,
    subscription: raw.subscription,
    generationsBalance: raw.generations_balance,
    avatarColor: raw.avatar_color,
    isTipsCompleted: raw.is_tips_completed,
    paymentMethodId: raw.payment_method_id,
    yaId: raw.ya_id,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  if (raw.subscription_until) {
    user.subscriptionUntil = new Date(raw.subscription_until)
  }

  return user
}

export async function login(credentials: LoginCredentials) {
  const user = await loginApi(credentials)

  return transformUser(user)
}
