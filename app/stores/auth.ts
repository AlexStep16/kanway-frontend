import { defineStore } from 'pinia'
import { logout as _logout } from '~/services/auth'

import type { IUser } from '~/interfaces/domain/IUser'
import { AuthStatus } from '~/enums/AuthStatusesEnum'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null)
  const status = ref<AuthStatus>(AuthStatus.IDLE)
  const { $queryClient } = useNuxtApp()

  async function initSession() {
    if (status.value !== AuthStatus.IDLE) return status.value

    status.value = AuthStatus.LOADING
    try {
      const data = await meApi()
      user.value = data

      status.value = data.isConfirmed ? AuthStatus.AUTHENTICATED : AuthStatus.UNVERIFIED

      $queryClient.setQueryData(userKeys.me, data)

      return status.value
    } catch (e: any) {
      const httpStatus = e.status || e.response?.status

      if (httpStatus === 401 || httpStatus === 404) {
        status.value = AuthStatus.GUEST
        user.value = null
        return AuthStatus.GUEST
      }

      status.value = AuthStatus.ERROR
      throw e
    }
  }

  async function logout() {
    try {
      await _logout()
    } catch (e) {
      console.error('Logout API error', e)
    } finally {
      user.value = null
      status.value = AuthStatus.GUEST

      $queryClient.clear()

      await navigateTo('/auth')
    }
  }

  function setAuthenticated(userData: IUser) {
    user.value = userData

    status.value = userData.isConfirmed ? AuthStatus.AUTHENTICATED : AuthStatus.UNVERIFIED

    $queryClient.setQueryData(userKeys.me, userData)
  }

  return { user, status, initSession, logout, setAuthenticated }
})
