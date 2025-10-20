import User from '@interfaces/User'
import { login } from '@/services/auth'
import { defineStore, Pinia } from 'pinia'
import { ref } from 'vue'
import LoginCredentials from '@interfaces/LoginCredentials'
import { BackendError, HttpError } from '@/utils/errors'
import { ErrorsMessage } from '@/enums/ErrorsMessage'

// Объединяем типы ошибок для простоты хранения в state
type LoginErrorType = BackendError | HttpError | null

export const useAuthStore = (pinia?: Pinia) => {
  return defineStore('auth', () => {
    const user = ref<User | null>(null)
    const loginError = ref<LoginErrorType>(null)

    async function handleLogin(credentials: LoginCredentials): Promise<boolean> {
      loginError.value = null

      try {
        const userPayload = await login(credentials)
        user.value = userPayload
        return true
      } catch (e) {
        if (e instanceof BackendError) {
          loginError.value = e
        } else if (e instanceof HttpError) {
          loginError.value = e

          if (e.status === 401) {
          }
        } else {
          loginError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
        }

        return false
      }
    }

    function $reset() {
      /* ... */
    }

    return {
      // State
      user,
      loginError,

      // Actions
      handleLogin,
      $reset,
    }
  })(pinia)
}
