import LoginCredentials from '@interfaces/LoginCredentials'
import {
  loginApi,
  registerApi,
  patchUserAvatarApi,
  patchUserApi,
  deleteUserApi,
  meApi,
  patchUserPasswordApi,
  resetAvatarApi,
  sendVerificationEmailApi,
  sendPasswordRecoveryEmailApi,
  passwordRecoveryApi,
  verifyEmailOTPApi,
  verifyEmailTokenApi,
  logoutApi,
  checkEmailExistsApi,
  verifyLoginOTPApi,
  sendMagicLinkApi,
  verifyLoginTokenApi,
  verifyPasswordTokenApi,
  verifyPasswordOTPApi,
  finishSignupApi,
  checkSignupTokenApi,
} from '@api/auth'
import IUser from '@models/UserModel'
import UserModel from '@models/UserModel'
import RegisterCredentials from '@interfaces/RegisterCredentials'
import { UpdatePasswordVars } from '@/composables/auth/mutations/useUpdatePassword'
import { FinishRegistrationDTO } from '@/interfaces/FinishRegistrationDTO'

export function transformUser(raw: IUser): UserModel {
  const user = new UserModel({
    ...raw,
    subscriptionUntil: raw.subscriptionUntil ? new Date(raw.subscriptionUntil) : undefined,
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

export async function getMe(): Promise<UserModel> {
  const user = await meApi()

  return transformUser(user)
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
  return await passwordRecoveryApi(password)
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
