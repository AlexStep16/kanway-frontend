import UserModel from '@/models/UserModel'
import { login, register } from '@services/auth'
import { defineStore, Pinia } from 'pinia'
import { ref } from 'vue'
import LoginCredentials from '@interfaces/LoginCredentials'
import { BackendError, HttpError } from '@/utils/errors'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { Nullable } from '@/types/utils'

// Объединяем типы ошибок для простоты хранения в state
type AuthErrorType = Nullable<BackendError | HttpError>

export const useAuthStore = (pinia?: Pinia) => {
  return defineStore('auth', () => {
    const user = ref<Nullable<UserModel>>(null)
    const loginError = ref<AuthErrorType>(null)
    const registerError = ref<AuthErrorType>(null)

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

    async function handleRegister(credentials: LoginCredentials): Promise<boolean> {
      registerError.value = null

      try {
        const userPayload = await register(credentials)
        user.value = userPayload

        return true
      } catch (e) {
        if (e instanceof BackendError) {
          registerError.value = e
        } else if (e instanceof HttpError) {
          registerError.value = e

          if (e.status === 401) {
          }
        } else {
          registerError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
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
      registerError,

      // Actions
      handleLogin,
      handleRegister,
      $reset,
    }
  })(pinia)
}
