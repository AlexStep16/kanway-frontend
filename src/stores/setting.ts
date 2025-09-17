import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Setting } from '../Interfaces/Setting';
import * as settingFunctions from '../helpers/setting';

export const useSettingStore = defineStore('setting', () => {
  const settings = ref<Setting>({
    is_delete_instead_archive: false,
    model: 1
  });
  const payments = ref<any>([]);
  const isPaymentsLoading = ref<boolean>(false);
  const isPaymentsLoaded = ref<boolean>(false);
  const isSettingsLoading = ref(false);
  const isSettingsLoaded = ref(false);

  function $reset() {
    settings.value = {
      is_delete_instead_archive: false,
      model: 1
    }
    isSettingsLoading.value = false;
    isSettingsLoaded.value = false;
  }

  function startLoading() {
    isSettingsLoading.value = true;
  }

  function endLoading() {
    isSettingsLoading.value = false;
    isSettingsLoaded.value = true;
  }

  async function updateSettings() {
    startLoading();

    await settingFunctions.edit.updateSettings();

    endLoading();
  }

  return {
    settings,
    payments,
    isSettingsLoaded,
    isSettingsLoading,
    isPaymentsLoading,
    isPaymentsLoaded,
    startLoading,
    endLoading,
    updateSettings,
    $reset
  }
})