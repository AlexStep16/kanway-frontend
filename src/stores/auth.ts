import { defineStore } from 'pinia'
import { queryClient } from '@/plugins/queryClient'
import { navigate } from 'vike/client/router'
import { logout as logoutService } from '@services/auth'

export const useAuthStore = defineStore('auth', () => {
  async function logout() {
    try {
      await logoutService()
    } catch {
      // ignore error
    } finally {
      await navigate('/auth')
      await queryClient.resetQueries()
    }
  }

  return {
    logout,
  }
})
