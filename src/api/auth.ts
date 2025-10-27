import { apiCall } from '@/apiClient'
import UserRaw from '@interfaces/UserRaw'
import LoginCredentials from '@interfaces/LoginCredentials'

export async function loginApi(credentials: LoginCredentials) {
  return await apiCall<UserRaw>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  })
}

export async function registerApi(credentials: LoginCredentials) {
  return await apiCall<UserRaw>({
    method: 'POST',
    url: '/auth/register',
    data: credentials,
  })
}

export async function meAuthApi() {
  return await apiCall<UserRaw>({
    method: 'GET',
    url: '/auth/me',
  })
}
