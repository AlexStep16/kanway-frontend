import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BackendError, HttpError } from '@/utils/errors'
import { Nullable } from '@/types/utils'
import SettingModel from '@models/SettingModel'
import {
  fetchPaymentMethods,
  fetchPayments,
  fetchSetting,
  fetchSubscriptions,
  deletePaymentMethod as deletePaymentMethodService,
  updateSetting as updateSettingService,
} from '@services/setting'
import { toast } from 'vue-sonner'
import { ErrorsMessage } from '@enums/ErrorsMessage'

import { IPayment } from '@interfaces/domain/IPayment'
import { ISubscription } from '@interfaces/domain/ISubscription'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { IPaymentMethod } from '@interfaces/domain/IPaymentMethod'
import { useAuthStore } from './auth'

type SettingErrorType = Nullable<BackendError | HttpError>

const AUTH_STORE = useAuthStore()

export const useSettingDataStore = defineStore('settingData', () => {
  const setting = ref<Nullable<SettingModel>>(null)
  const subscriptions = ref<ISubscription[]>([])
  const payments = ref<IPayment[]>([])
  const paymentMethods = ref<IPaymentMethod[]>([])

  // Errors
  const loadSettingError = ref<SettingErrorType>(null)
  const _updateSettingError = ref<SettingErrorType>(null)

  const loadSubscriptionsError = ref<SettingErrorType>(null)
  const loadPaymentsError = ref<SettingErrorType>(null)
  const loadPaymentMethodsError = ref<SettingErrorType>(null)
  const _deletePaymentMethodsError = ref<Map<string, SettingErrorType>>(new Map())

  // Loading
  const _isSettingsLoaded = ref(false)
  const _isSettingsLoading = ref(false)
  const _isSettingUpdating = ref(false)

  const _isSubscriptionsLoaded = ref(false)
  const _isSubscriptionsLoading = ref(false)

  const _isPaymentsLoaded = ref(false)
  const _isPaymentsLoading = ref(false)

  const _isPaymentMethodsLoaded = ref(false)
  const _isPaymentMethodsLoading = ref(false)

  const _deletingPaymentMethods = ref<Set<string>>(new Set())

  async function loadSetting() {
    if (_isSettingsLoaded.value || _isSettingsLoading.value) return

    loadSettingError.value = null
    _isSettingsLoading.value = true

    try {
      const settingData = await fetchSetting()

      setting.value = settingData

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadSettingError.value = e
      } else if (e instanceof HttpError) {
        loadSettingError.value = e

        if (e.status === 401) {
        }
      } else {
        loadSettingError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadSettingError.value.message)

      return false
    } finally {
      _isSettingsLoading.value = false
    }
  }

  async function updateSetting(
    settingPayload: Partial<SettingModel>,
  ): Promise<SettingModel | false> {
    if (_isSettingUpdating.value) {
      toast.error('Обновление настроек уже выполняется. Пожалуйста, подождите.')

      return false
    }

    try {
      _isSettingUpdating.value = true

      const updatedSetting = await updateSettingService(settingPayload)

      if (setting.value) {
        Object.assign(setting.value, updatedSetting)

        toast.success('Настройки успешно обновлены.')

        return setting.value
      }

      return false
    } catch (e) {
      if (e instanceof BackendError) {
        _updateSettingError.value = e
      } else if (e instanceof HttpError) {
        _updateSettingError.value = e

        if (e.status === 401) {
        }
      } else {
        _updateSettingError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(_updateSettingError.value.message)

      return false
    } finally {
      _isSettingUpdating.value = false
    }
  }

  async function loadSubscriptions() {
    if (_isSubscriptionsLoaded.value || _isSubscriptionsLoading.value) return

    loadSubscriptionsError.value = null
    _isSubscriptionsLoading.value = true

    try {
      const subscriptionsData = await fetchSubscriptions()

      subscriptions.value = subscriptionsData

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadSubscriptionsError.value = e
      } else if (e instanceof HttpError) {
        loadSubscriptionsError.value = e

        if (e.status === 401) {
        }
      } else {
        loadSubscriptionsError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadSubscriptionsError.value.message)

      return false
    } finally {
      _isSubscriptionsLoading.value = false
    }
  }

  async function loadPayments() {
    if (_isPaymentsLoaded.value || _isPaymentsLoading.value) return

    loadPaymentsError.value = null
    _isPaymentsLoading.value = true

    try {
      const paymentsData = await fetchPayments()

      payments.value = paymentsData

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadPaymentsError.value = e
      } else if (e instanceof HttpError) {
        loadPaymentsError.value = e

        if (e.status === 401) {
        }
      } else {
        loadPaymentsError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadPaymentsError.value.message)

      return false
    } finally {
      _isPaymentsLoading.value = false
    }
  }

  async function loadPaymentMethods() {
    if (_isPaymentMethodsLoaded.value || _isPaymentMethodsLoading.value) return

    loadPaymentMethodsError.value = null
    _isPaymentMethodsLoading.value = true

    try {
      const paymentMethodsData = await fetchPaymentMethods()

      paymentMethods.value = paymentMethodsData

      return true
    } catch (e) {
      if (e instanceof BackendError) {
        loadPaymentMethodsError.value = e
      } else if (e instanceof HttpError) {
        loadPaymentMethodsError.value = e

        if (e.status === 401) {
        }
      } else {
        loadPaymentMethodsError.value = new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null)
      }

      toast.error(loadPaymentMethodsError.value.message)

      return false
    } finally {
      _isPaymentMethodsLoading.value = false
    }
  }

  async function deletePaymentMethod(id: string) {
    if (_deletingPaymentMethods.value.has(id)) {
      toast.error('Удаление данного метода оплаты уже выполняется. Пожалуйста, подождите.')
      return false
    }

    _deletingPaymentMethods.value.add(id)

    try {
      await deletePaymentMethodService(id)
      await AUTH_STORE.forceLoadMe()

      toast.success('Метод оплаты успешно удален.')

      paymentMethods.value = paymentMethods.value.filter((method) => method.id !== id)
    } catch (e) {
      if (e instanceof BackendError) {
        _deletePaymentMethodsError.value.set(id, e)
      } else if (e instanceof HttpError) {
        _deletePaymentMethodsError.value.set(id, e)

        if (e.status === 401) {
        }
      } else {
        _deletePaymentMethodsError.value.set(
          id,
          new HttpError(ErrorsMessage.UNEXPECTED_ERROR, null),
        )
      }

      const error = _deletePaymentMethodsError.value.get(id)
      toast.error(error ? error.message : 'Произошла ошибка при удалении метода оплаты.')

      return false
    } finally {
      _deletingPaymentMethods.value.delete(id)
    }
  }

  const isSettingLoading = computed(() => _isSettingsLoading.value)
  const isSettingUpdating = computed(() => _isSettingUpdating.value)

  const isSubscriptionsLoading = computed(() => _isSubscriptionsLoading.value)
  const isPaymentsLoading = computed(() => _isPaymentsLoading.value)
  const isPaymentMethodsLoading = computed(() => _isPaymentMethodsLoading.value)
  const isPaymentMethodDeleting = computed(
    () => (id: string) => _deletingPaymentMethods.value.has(id),
  )

  const getSubscriptionById = computed(() => (id: SubscriptionPlanEnum) => {
    return subscriptions.value.find((sub) => sub.id === id)
  })

  function $reset() {
    /* ... */
  }

  return {
    // State
    setting,
    subscriptions,
    payments,
    isSubscriptionsLoading,
    getSubscriptionById,
    isPaymentsLoading,
    loadSettingError,
    isSettingLoading,
    isSettingUpdating,
    loadSubscriptionsError,
    loadPaymentsError,
    paymentMethods,
    isPaymentMethodsLoading,
    loadPaymentMethodsError,
    isPaymentMethodDeleting,

    // Actions
    loadSetting,
    updateSetting,
    loadSubscriptions,
    loadPayments,
    loadPaymentMethods,
    deletePaymentMethod,

    $reset,
  }
})
