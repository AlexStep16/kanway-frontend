import type LoginCredentials from '~/interfaces/LoginCredentials'
import IUser from '~/models/UserModel'
import UserModel from '~/models/UserModel'
import type RegisterCredentials from '~/interfaces/RegisterCredentials'
import type { FinishRegistrationDTO } from '~/interfaces/FinishRegistrationDTO'
import { linkVkAccountApi, linkYandexAccountApi, unlinkAccountApi } from '~/utils/api/auth'
import type { YandexAuthDTO } from '~/interfaces/YandexAuthDTO'
import type { VkAuthDTO } from '~/interfaces/VkAuthDTO'
import dayjs from 'dayjs'

export function transformUser(raw: IUser): UserModel {
  const timezone = raw?.timezone || dayjs.tz.guess()

  const user = new UserModel({
    ...raw,
    subscriptionUntil: raw.subscriptionUntil ? new Date(raw.subscriptionUntil) : undefined,
    deletedTime: raw.deletedTime ? dayjs.utc(raw?.deletedTime).tz(timezone).toDate() : undefined,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  })

  return user
}

export async function login(credentials: LoginCredentials) {
  const user = await loginApi(credentials)

  return transformUser(user)
}

export async function logout() {
  return await logoutApi()
}

export async function register(credentials: RegisterCredentials) {
  const user = await registerApi(credentials)

  return transformUser(user)
}

export async function finishSignup(credentials: FinishRegistrationDTO) {
  const user = await finishSignupApi(credentials)

  return transformUser(user)
}

export async function checkFinishSignupToken(): Promise<null> {
  return await checkSignupTokenApi()
}

export async function checkEmailExists(email: string): Promise<boolean> {
  return await checkEmailExistsApi(email)
}

export async function getMe(): Promise<UserModel | null> {
  try {
    return transformUser(await meApi())
  } catch (error: any) {
    if (
      (error instanceof HttpError && error.status === 401) ||
      (error instanceof BackendError && error.code === 401)
    ) {
      return null
    }

    if (
      (error instanceof HttpError && error.status === 403) ||
      (error instanceof BackendError && error.code === 403)
    ) {
      return null
    }

    throw error
  }
}

export async function updateAvatar(formData: FormData): Promise<string> {
  return await patchUserAvatarApi(formData)
}

export async function resetAvatar(): Promise<void> {
  return await resetAvatarApi()
}

export async function updateUser(payload: Partial<IUser>): Promise<IUser> {
  const updatedUser = await patchUserApi(payload)

  return transformUser(updatedUser)
}

export async function updatePassword(payload: UpdatePasswordVars): Promise<IUser> {
  const updatedUser = await patchUserPasswordApi(payload)

  return transformUser(updatedUser)
}

export async function yandexAuth(payload: YandexAuthDTO): Promise<IUser> {
  return transformUser(await yandexAuthApi(payload))
}

export async function vkAuth(payload: VkAuthDTO): Promise<UserModel | null> {
  const raw = await vkAuthApi(payload)
  if (!raw) return null
  return transformUser(raw)
}

export async function linkYandexAccount(payload: YandexAuthDTO): Promise<IUser> {
  return transformUser(await linkYandexAccountApi(payload))
}

export async function linkVkAccount(payload: VkAuthDTO): Promise<IUser> {
  return transformUser(await linkVkAccountApi(payload))
}

export async function unlinkAccount(provider: 'yandex' | 'vk'): Promise<IUser> {
  return transformUser(await unlinkAccountApi(provider))
}

export async function deleteUser(): Promise<null> {
  return await deleteUserApi()
}

export async function sendVerificationEmail(): Promise<null> {
  return await sendVerificationEmailApi()
}

export async function sendMagicLink(email: string): Promise<null> {
  return await sendMagicLinkApi(email)
}

export async function sendPasswordRecoveryEmail(email: string): Promise<null> {
  return await sendPasswordRecoveryEmailApi(email)
}

export async function passwordRecovery(password: string): Promise<IUser> {
  return transformUser(await passwordRecoveryApi(password))
}

export async function verifyEmailToken(token: string): Promise<null> {
  return await verifyEmailTokenApi(token)
}

export async function verifyLoginToken(token: string): Promise<null> {
  return await verifyLoginTokenApi(token)
}

export async function verifyPasswordToken(token: string): Promise<null> {
  return await verifyPasswordTokenApi(token)
}

export async function verifyEmailOTP(code: string, email: string): Promise<null> {
  return await verifyEmailOTPApi(code, email)
}

export async function verifyLoginOTP(code: string, email: string): Promise<null> {
  return await verifyLoginOTPApi(code, email)
}

export async function verifyPasswordOTP(code: string, email: string): Promise<null> {
  return await verifyPasswordOTPApi(code, email)
}
