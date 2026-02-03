import { apiCall } from '@/apiClient'
import IUser from '@models/UserModel'
import LoginCredentials from '@interfaces/LoginCredentials'
import RegisterCredentials from '@interfaces/RegisterCredentials'
import { UpdatePasswordVars } from '@/composables/auth/mutations/useUpdatePassword'
import { TokenTypesEnum } from '@/enums/TokenTypesEnum'

export async function loginApi(credentials: LoginCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
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

export async function sendVerificationEmailByTokenApi(token: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/send/verify/' + token,
  })
}

export async function sendPasswordRecoveryEmailApi(email: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/send/password/recovery',
    data: { email },
  })
}

export async function sendPasswordRecoveryEmailByTokenApi(token: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/send/password/recovery/' + token,
    data: { token },
  })
}

export async function confirmEmailApi(token: string) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify',
    data: { token },
  })
}

export async function passwordRecoveryApi(token: string, password: string) {
  return apiCall<IUser>({
    method: 'POST',
    url: '/auth/password/recovery',
    data: { password, token },
  })
}

export async function validateTokenApi(token: string, type: TokenTypesEnum) {
  return apiCall<null>({
    method: 'POST',
    url: '/auth/verify/token',
    data: { token, type },
  })
}
