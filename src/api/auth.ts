import { apiCall } from '@/apiClient'
import User from '@interfaces/User'
import LoginCredentials from '@interfaces/LoginCredentials'

export async function loginApi(credentials: LoginCredentials): Promise<User> {
  return await apiCall<User>({
    method: 'POST',
    url: '/auth/login',
    data: credentials,
  })
}

export async function checkAuthApi(): Promise<User> {
  return await apiCall<User>({
    method: 'GET',
    url: '/auth/check',
  })
}
