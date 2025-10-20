<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { X } from 'lucide-vue-next'
import Sidebar from '@components/Workspace/Settings/Sidebar.vue'
import General from '@components/Workspace/Settings/General.vue'
import Security from '@components/Workspace/Settings/Security.vue'
import Assistant from '@components/Workspace/Settings/Assistant.vue'
import Subscription from '@components/Workspace/Settings/Subscription.vue'
import Payments from '@components/Workspace/Settings/Payments.vue'
import { SettingTabs } from '@/enums/SettingTabs'
import { onMounted, ref } from 'vue'

const UI_STORE = useUIStore()

const currentTab = ref(SettingTabs.GENERAL)

onMounted(() => {
  window.HSStaticMethods.autoInit()
})
</script>

<template>
  <div
    id="hs-settings"
    :ref="
      (el) => {
        if (el) UI_STORE.settingsModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-80 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
    aria-labelledby="hs-task-edit-label"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col size-full max-w-4xl max-h-160 bg-white rounded-md pointer-events-auto px-3 sm:px-4 py-2 sm:py-3 gap-y-2 sm:gap-y-4 overflow-auto"
      >
        <!-- Header -->
        <div
          class="flex justify-between items-center gap-x-2 pb-1 sm:pb-2 border-b border-gray-200"
        >
          <h5 id="hs-task-edit-label" class="sm:text-lg font-semibold text-gray-900">Настройки</h5>
          <button
            class="transition-colors duration-100 text-gray-500 hover:bg-gray-200 p-1 rounded-full"
            type="button"
            @click="UI_STORE.closeSettingsModal()"
          >
            <X class="size-5" />
          </button>
        </div>
        <!-- Body -->
        <div class="flex grow-1 min-h-0">
          <!-- Sidebar -->
          <Sidebar
            @selectTab="
              (tab: SettingTabs) => {
                currentTab = tab
              }
            "
            :currentTab
          />
          <!-- Content -->
          <div class="grow-1 flex flex-col gap-y-4 ps-3 sm:ps-6 pe-1 overflow-y-auto">
            <General v-if="currentTab === SettingTabs.GENERAL" />
            <Security v-if="currentTab === SettingTabs.SECURITY" />
            <Assistant v-if="currentTab === SettingTabs.ASSISTANT" />
            <Subscription v-if="currentTab === SettingTabs.SUBSCRIPTION" />
            <Payments v-if="currentTab === SettingTabs.PAYMENTS" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
