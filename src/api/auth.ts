import { apiCall } from '@/apiClient'
import IUser from '@models/UserModel'
import LoginCredentials from '@interfaces/LoginCredentials'
import RegisterCredentials from '@interfaces/RegisterCredentials'
import { UpdatePasswordVars } from '@/composables/auth/useUpdatePassword'

export async function loginApi(credentials: LoginCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
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
