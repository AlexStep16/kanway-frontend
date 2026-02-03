import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Nullable } from '@/types/utils'
import UserModel from '@models/UserModel'
import { queryClient } from '@/plugins/queryClient'
import { navigate } from 'vike/client/router'
import { logout as logoutService } from '@services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Nullable<UserModel>>(null)

  const isAuthenticated = computed(() => !!user.value)

  function setUser(userPayload: Nullable<UserModel>) {
    user.value = userPayload
  }

  async function logout() {
    if (!isAuthenticated.value) return

    try {
      await logoutService()
    } catch {
      // ignore error
    } finally {
      await navigate('/sign-in')

      setUser(null)
      queryClient.clear()
      localStorage.clear()
    }
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
  }
})
