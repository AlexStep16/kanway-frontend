import { apiCall } from '@/apiClient'
import IUser from '@models/UserModel'
import LoginCredentials from '@interfaces/LoginCredentials'
import RegisterCredentials from '@interfaces/RegisterCredentials'
import { UpdatePasswordVars } from '@/composables/auth/mutations/useUpdatePassword'
import { YandexAuthDTO } from '@/interfaces/YandexAuthDTO'
import { VkAuthDTO } from '@/interfaces/VkAuthDTO'

export async function loginApi(credentials: LoginCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  })
}

export async function yandexAuthApi(payload: YandexAuthDTO) {
  return await apiCall<null>({
    method: 'POST',
    url: '/auth/yandex',
    data: payload,
  })
}

export async function vkAuthApi(payload: VkAuthDTO) {
  return await apiCall<null>({
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
    url: '/auth/register',
    data: credentials,
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
