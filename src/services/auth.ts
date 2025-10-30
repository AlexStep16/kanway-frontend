import LoginCredentials from '@interfaces/LoginCredentials'
import { loginApi, registerApi } from '@api/auth'
import IUser from '@models/UserModel'
import UserModel from '@/models/UserModel'

export function transformUser(raw: IUser): UserModel {
  const user = new UserModel({
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  if (raw.subscriptionUntil) {
    user.subscriptionUntil = new Date(raw.subscriptionUntil)
  }

  return user
}

export async function login(credentials: LoginCredentials) {
  const user = await loginApi(credentials)

  return transformUser(user)
}

export async function register(credentials: LoginCredentials) {
  const user = await registerApi(credentials)

  return transformUser(user)
}
