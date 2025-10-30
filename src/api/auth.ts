import { apiCall } from '@/apiClient'
import IUser from '@models/UserModel'
import LoginCredentials from '@interfaces/LoginCredentials'

export async function loginApi(credentials: LoginCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  })
}

export async function registerApi(credentials: LoginCredentials) {
  return await apiCall<IUser>({
    method: 'POST',
    url: '/auth/register',
    data: credentials,
  })
}

export async function meAuthApi() {
  return await apiCall<IUser>({
    method: 'GET',
    url: '/auth/me',
  })
}
