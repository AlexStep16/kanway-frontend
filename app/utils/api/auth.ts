import IUser from '~/models/UserModel'
import type LoginCredentials from '~/interfaces/LoginCredentials'
import type RegisterCredentials from '~/interfaces/RegisterCredentials'
import type { YandexAuthDTO } from '~/interfaces/YandexAuthDTO'
import type { VkAuthDTO } from '~/interfaces/VkAuthDTO'
import type { FinishRegistrationDTO } from '~/interfaces/FinishRegistrationDTO'

export async function loginApi(credentials: LoginCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/sign-in',
    data: credentials,
  })
}

export async function yandexAuthApi(payload: YandexAuthDTO) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/yandex',
    data: payload,
  })
}

export async function vkAuthApi(payload: VkAuthDTO) {
  return await apiCall<IUser | null>({
    method: 'POST',
    url: '/auth/vk',
    data: payload,
  })
}

export async function logoutApi() {
  return await apiCall<null>({
    method: 'POST',
    url: '/me/logout',
  })
}

export async function registerApi(credentials: RegisterCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/sign-up',
    data: credentials,
  })
}

export async function finishSignupApi(data: FinishRegistrationDTO) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/sign-up/finish',
    data,
  })
}

export async function checkSignupTokenApi() {
  return await apiCall<null>({
    method: 'GET',
    url: '/auth/sign-up/finish/check',
  })
}

export async function checkEmailExistsApi(email: string) {
  return await apiCall<boolean>({
    method: 'POST',
    url: '/auth/check-email',
    data: { email },
  })
}

export async function meApi() {
  return await apiCall<IUser>({
    method: 'GET',
    url: '/me',
  })
}

export async function patchUserAvatarApi(formData: FormData) {
  return await apiCall<string>({
    method: 'PATCH',
    url: '/me/avatar',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export async function resetAvatarApi() {
  return await apiCall<void>({
    method: 'DELETE',
    url: '/me/avatar',
  })
}

export async function patchUserApi(payload: Partial<IUser>) {
  return apiCall<IUser>({
    method: 'PATCH',
    url: '/me',
    data: payload,
  })
}

export async function patchUserPasswordApi(payload: UpdatePasswordVars) {
  return apiCall<IUser>({
    method: 'PATCH',
    url: '/me',
    data: payload,
  })
}

export async function linkYandexAccountApi(payload: YandexAuthDTO) {
  return apiCall<IUser>({
    method: 'POST',
    url: '/me/accounts/yandex',
    data: payload,
  })
}

export async function linkVkAccountApi(payload: VkAuthDTO) {
  return apiCall<IUser>({
    method: 'POST',
    url: '/me/accounts/vk',
    data: payload,
  })
}

export async function unlinkAccountApi(provider: 'yandex' | 'vk') {
  return apiCall<IUser>({
    method: 'DELETE',
    url: `/me/accounts/${provider}`,
  })
}

export async function deleteUserApi() {
  return apiCall<null>({
    method: 'DELETE',
    url: '/me',
  })
}

export async function sendVerificationEmailApi() {
  return apiCall<null>({
    method: 'POST',
    url: '/me/send/verify',
  })
}

export async function sendMagicLinkApi(email: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/send/magic-link',
    data: { email },
  })
}

export async function sendPasswordRecoveryEmailApi(email: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/send/password/recovery',
    data: { email },
  })
}

export async function verifyEmailTokenApi(token: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/token/email',
    data: { token },
  })
}

export async function verifyLoginTokenApi(token: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/token/login',
    data: { token },
  })
}

export async function verifyPasswordTokenApi(token: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/token/password',
    data: { token },
  })
}

export async function verifyEmailOTPApi(code: string, email: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/otp/email',
    data: { code, email },
  })
}

export async function verifyLoginOTPApi(code: string, email: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/otp/login',
    data: { code, email },
  })
}

export async function verifyPasswordOTPApi(code: string, email: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/otp/password',
    data: { code, email },
  })
}

export async function passwordRecoveryApi(password: string) {
  return apiCall<IUser>({
    method: 'POST',
    url: '/auth/password/recovery',
    data: { password },
  })
}

export async function checkPasswordStrengthApi(password: string) {
  return apiCall<{ score: number; feedback: { warning: string; suggestions: string[] } }>({
    method: 'POST',
    url: '/auth/check-password-strength',
    data: { password },
  })
}
