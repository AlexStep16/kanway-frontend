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

export async function checkAuthApi() {
  return await apiCall<UserRaw>({
    method: 'GET',
    url: '/auth/check',
  })
}
