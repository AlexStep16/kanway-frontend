<script setup lang="ts">
import SettingsSidebar from '~/components/Workspace/Settings/SettingsSidebar.vue'
import SettingsGeneral from '~/components/Workspace/Settings/SettingsGeneral.vue'
import SettingsSecurity from '~/components/Workspace/Settings/SettingsSecurity.vue'
import SettingsAssistant from '~/components/Workspace/Settings/SettingsAssistant.vue'
import SettingsSubscription from '~/components/Workspace/Settings/SettingsSubscription.vue'
import SettingsPayments from '~/components/Workspace/Settings/SettingsPayments.vue'
import { SettingTabs } from '~/enums/SettingTabs'

const uiStore = useUIStore()

const currentTab = computed(() => uiStore.currentSettingsTab)
</script>

<template>
  <Dialog v-model:open="uiStore.isSettingsModalOpen">
    <DialogContent
      class="flex flex-col size-full sm:max-w-[calc(100%-2rem)] md:max-w-2xl lg:max-w-4xl max-h-[95svh] md:max-h-160 bg-white rounded-sm md:rounded-md pointer-events-auto px-3 md:px-4 py-2 md:py-3 gap-y-2 md:gap-y-4 overflow-auto"
    >
      <div class="flex justify-between items-center gap-x-2 pb-1 md:pb-2 border-b border-gray-200">
        <DialogTitle class="text-lg font-semibold text-foreground">Настройки</DialogTitle>
      </div>

      <div class="flex grow min-h-0 overflow-hidden">
        <SettingsSidebar
          :currentTab="currentTab"
          @selectTab="(tab: SettingTabs) => (uiStore.currentSettingsTab = tab)"
        />

        <div class="grow flex flex-col gap-y-4 ps-3 md:ps-6 pe-1 overflow-y-auto custom-scrollbar">
          <SettingsGeneral v-if="currentTab === SettingTabs.GENERAL" />
          <SettingsSecurity v-if="currentTab === SettingTabs.SECURITY" />
          <SettingsAssistant v-if="currentTab === SettingTabs.ASSISTANT" />
          <SettingsSubscription v-if="currentTab === SettingTabs.SUBSCRIPTION" />
          <SettingsPayments v-if="currentTab === SettingTabs.PAYMENTS" />
        </div>
      </div>

      <DialogDescription class="sr-only">
        Управление профилем, безопасностью и подписками
      </DialogDescription>
    </DialogContent>
  </Dialog>
</template>
