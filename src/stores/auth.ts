import UserModel from '@models/UserModel'
import {
  login,
  register,
  updateAvatar as updateAvatarService,
  deleteUser,
  getMe,
} from '@services/auth'
import { defineStore, Pinia } from 'pinia'
import { computed, ref } from 'vue'
import LoginCredentials from '@interfaces/LoginCredentials'
import { BackendError, HttpError } from '@/utils/errors'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { Nullable } from '@/types/utils'
import { toast } from 'vue-sonner'
import { patchUserApi, patchUserPasswordApi } from '@/api/auth'
import dayjs from 'dayjs'
import { requestQueueService } from '@utils/RequestQueueService'
import { ISingleUpdate } from '@interfaces/domain/ISingleUpdate'

// Объединяем типы ошибок для простоты хранения в state
type AuthErrorType = Nullable<BackendError | HttpError>

export const useAuthStore = (pinia?: Pinia) => {
  return defineStore('auth', () => {
    const user = ref<Nullable<UserModel>>(null)

    // Errors
    const loginError = ref<AuthErrorType>(null)
    const registerError = ref<AuthErrorType>(null)
    const passwordUpdateError = ref<
      Nullable<{
        oldPassword?: string
        newPassword?: string
      }>
    >(null)
    const _userDeleteError = ref<AuthErrorType>(null)

    // Loading
    const _isUserUpdating = ref(false)
    const _isUserAvatarUpdating = ref(false)
    const _isUserTimezoneUpdating = ref(false)
    const _isUserNameUpdating = ref(false)
    const _isPasswordUpdating = ref(false)
    const _isUserPaymentMethodUpdating = ref(false)
    const _isUserDeleting = ref(false)

    async function forceLoadMe() {
      if (!user.value) return

      try {
        const userPayload = await getMe()

        Object.assign(user.value, userPayload)
      } catch (e) {
        throw e
      }
    }

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
        const userPayload = await register({
          ...credentials,
          timezone: dayjs.tz.guess(),
        })
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

    function setUser(userPayload: UserModel) {
      user.value = userPayload
    }

    async function updateAvatar(file: File): Promise<boolean> {
      if (_isUserAvatarUpdating.value) {
        toast.error('Пожалуйста, дождитесь завершения текущего процесса обновления.')
        return false
      }

      try {
        _isUserAvatarUpdating.value = true

        const formData = new FormData()
        formData.append('avatar', file)

        const newUrl = await updateAvatarService(formData)

        if (user.value) {
          user.value.avatarUrl = newUrl
        }

        toast.success('Аватар успешно обновлен')

        return true
      } catch (e) {
        if (e instanceof BackendError || e instanceof HttpError) {
          toast.error(e.message)
        } else {
          toast.error(ErrorsMessage.UNEXPECTED_ERROR)
        }

        return false
      } finally {
        _isUserAvatarUpdating.value = false
      }
    }

    async function _update(userPayload: ISingleUpdate<UserModel>): Promise<UserModel | false> {
      try {
        _isUserUpdating.value = true

        const coreAction = () => patchUserApi(userPayload)

        const updatedUser = await requestQueueService.enqueue(userPayload.id, coreAction)

        if (user.value) {
          Object.assign(user.value, updatedUser)

          return user.value
        }

        return false
      } catch (e) {
        throw e
      } finally {
        _isUserUpdating.value = false
      }
    }

    async function updateUserName(username: string): Promise<UserModel | false> {
      if (!user.value) return false
      if (isUserNameUpdating.value) {
        toast.error('Пожалуйста, дождитесь завершения текущего процесса обновления.')
        return false
      }

      try {
        _isUserNameUpdating.value = true

        const updatedUser = await _update({ username, id: user.value.id })

        if (updatedUser) {
          return updatedUser
        }

        return false
      } finally {
        _isUserNameUpdating.value = false
      }
    }

    async function updateUserTimezone(timezone: string): Promise<UserModel | false> {
      if (!user.value) return false
      if (isUserTimezoneUpdating.value) {
        toast.error('Пожалуйста, дождитесь завершения текущего процесса обновления.')
        return false
      }

      try {
        _isUserTimezoneUpdating.value = true

        const updatedUser = await _update({ timezone, id: user.value.id })

        if (updatedUser) {
          return updatedUser
        }

        return false
      } finally {
        _isUserTimezoneUpdating.value = false
      }
    }

    async function updateUserPassword(
      oldPassword: string,
      password: string,
    ): Promise<UserModel | false> {
      if (!user.value) return false
      if (isPasswordUpdating.value) {
        toast.error('Пожалуйста, дождитесь завершения текущего процесса обновления.')
        return false
      }

      try {
        _isPasswordUpdating.value = true

        const coreAction = () =>
          patchUserPasswordApi({ oldPassword: oldPassword, newPassword: password })

        const updatedUser = await requestQueueService.enqueue(user.value.id, coreAction)

        if (updatedUser) {
          toast.success('Пароль успешно обновлен')

          return updatedUser
        }

        return false
      } catch (e) {
        if (e instanceof BackendError || e instanceof HttpError) {
          try {
            passwordUpdateError.value = JSON.parse(e.message)
          } catch {
            toast.error(e.message)

            passwordUpdateError.value = null
          }
        } else {
          toast.error(ErrorsMessage.UNEXPECTED_ERROR)

          passwordUpdateError.value = null
        }

        return false
      } finally {
        _isPasswordUpdating.value = false
      }
    }

    async function updateUserPaymentMethod(paymentMethodId: string): Promise<UserModel | false> {
      if (!user.value) return false
      if (isUserPaymentMethodUpdating.value) {
        toast.error('Пожалуйста, дождитесь завершения текущего процесса обновления.')
        return false
      }
      const oldPaymentMethodId = user.value.paymentMethodId

      if (paymentMethodId === oldPaymentMethodId) return false

      try {
        Object.assign(user.value, { paymentMethodId })

        _isUserPaymentMethodUpdating.value = true

        const updatedUser = await _update({ paymentMethodId, id: user.value.id })

        if (updatedUser) {
          return updatedUser
        }

        return false
      } catch {
        if (user.value && oldPaymentMethodId) {
          Object.assign(user.value, { paymentMethodId: oldPaymentMethodId })
        }

        return false
      } finally {
        _isUserPaymentMethodUpdating.value = false
      }
    }

    async function _delete() {
      await deleteUser()
    }

    async function deleteAccount() {
      if (_isUserDeleting.value) {
        toast.error('Пожалуйста, дождитесь завершения текущего процесса удаления.')
        return
      }

      try {
        _isUserDeleting.value = true

        await _delete()

        toast.success('Аккаунт успешно удален')

        // Очистка состояния пользователя
        user.value = null

        // LOGOUT USER FROM APP
      } catch (e) {
        if (e instanceof BackendError || e instanceof HttpError) {
          try {
            _userDeleteError.value = e
          } catch {
            toast.error(e.message)

            _userDeleteError.value = null
          }
        } else {
          toast.error('Не удалось удалить аккаунт. Пожалуйста, попробуйте позже.')
        }
      } finally {
        _isUserDeleting.value = false
      }
    }

    const isUserTimezoneUpdating = computed(() => _isUserTimezoneUpdating.value)
    const isUserUpdating = computed(() => _isUserUpdating.value)
    const isUserNameUpdating = computed(() => _isUserNameUpdating.value)
    const isPasswordUpdating = computed(() => _isPasswordUpdating.value)
    const isUserPaymentMethodUpdating = computed(() => _isUserPaymentMethodUpdating.value)
    const isUserDeleting = computed(() => _isUserDeleting.value)

    function resetPasswordUpdateError() {
      passwordUpdateError.value = null
    }

    function $reset() {
      /* ... */
    }

    return {
      // State
      user,
      loginError,
      registerError,
      isUserTimezoneUpdating,
      isUserUpdating,
      isUserNameUpdating,
      isPasswordUpdating,
      isUserDeleting,
      passwordUpdateError,
      isUserPaymentMethodUpdating,

      // Actions
      forceLoadMe,
      handleLogin,
      handleRegister,
      updateAvatar,
      setUser,
      updateUserName,
      updateUserTimezone,
      updateUserPassword,
      resetPasswordUpdateError,
      deleteAccount,
      updateUserPaymentMethod,

      $reset,
    }
  })(pinia)
}
