import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Nullable } from '@/types/utils'
import UserModel from '@models/UserModel'
import { queryClient } from '@/plugins/queryClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Nullable<UserModel>>(null)

  const isAuthenticated = computed(() => !!user.value)

  function setUser(userPayload: Nullable<UserModel>) {
    user.value = userPayload
  }

  function logout() {
    setUser(null)
    // Очищаем ВЕСЬ кэш TanStack Query при выходе
    queryClient.clear()
    localStorage.clear()
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
  }
})
