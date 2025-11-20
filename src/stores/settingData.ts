import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BackendError, HttpError } from '@/utils/errors'
import { Nullable } from '@/types/utils'
import SettingModel from '@models/SettingModel'
import { fetchSetting } from '@services/setting'
import { toast } from 'vue-sonner'
import { ErrorsMessage } from '@enums/ErrorsMessage'
import { patchSettingApi } from '@api/settings'

type SettingErrorType = Nullable<BackendError | HttpError>

export const useSettingDataStore = defineStore('settingData', () => {
  const setting = ref<Nullable<SettingModel>>(null)

  // Errors
  const loadSettingError = ref<SettingErrorType>(null)
  const _updateSettingError = ref<SettingErrorType>(null)

  // Loading
  const _isSettingsLoaded = ref(false)
  const _isSettingsLoading = ref(false)
  const _isSettingUpdating = ref(false)

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

      const updatedSetting = await patchSettingApi(settingPayload)

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

  const isSettingLoading = computed(() => _isSettingsLoading.value)
  const isSettingUpdating = computed(() => _isSettingUpdating.value)

  function $reset() {
    /* ... */
  }

  return {
    // State
    setting,
    loadSettingError,
    isSettingLoading,
    isSettingUpdating,

    // Actions
    loadSetting,
    updateSetting,

    $reset,
  }
})
