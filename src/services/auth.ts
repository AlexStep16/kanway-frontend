import LoginCredentials from '@interfaces/LoginCredentials'
import {
  loginApi,
  registerApi,
  updateAvatarApi,
  patchUserApi,
  deleteUserApi,
  meApi,
} from '@api/auth'
import IUser from '@models/UserModel'
import UserModel from '@models/UserModel'
import RegisterCredentials from '@interfaces/RegisterCredentials'

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

export async function register(credentials: RegisterCredentials) {
  const user = await registerApi(credentials)

  return transformUser(user)
}

export async function getMe(): Promise<UserModel> {
  const user = await meApi()

  return transformUser(user)
}

export async function updateAvatar(formData: FormData): Promise<string> {
  return await updateAvatarApi(formData)
}

export async function updateUser(payload: Partial<IUser>): Promise<IUser> {
  const updatedUser = await patchUserApi(payload)

  return transformUser(updatedUser)
}

export async function deleteUser(): Promise<null> {
  return await deleteUserApi()
}
