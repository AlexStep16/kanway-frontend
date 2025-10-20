import User from '@interfaces/User'
import LoginCredentials from '@interfaces/LoginCredentials'
import { loginApi } from '@api/auth'

export async function login(credentials: LoginCredentials): Promise<User> {
  const user = await loginApi(credentials)

  return user
}
