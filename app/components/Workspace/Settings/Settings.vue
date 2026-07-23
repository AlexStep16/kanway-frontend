<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { SettingTabs } from '~/enums/SettingTabs'

const uiStore = useUIStore()

const currentTab = computed(() => uiStore.currentSettingsTab)
</script>
<template>
  <header class="flex justify-between h-12 sm:h-16 shrink-0 items-center gap-2 px-4">
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mr-0 data-[orientation=vertical]:h-4"
      />
      <div class="flex items-center gap-2 text-secondary-foreground">
        <Settings class="size-4 shrink-0" />
        <span class="truncate whitespace-nowrap text-sm font-medium"> Настройки </span>
      </div>
    </div>
  </header>

  <Separator />
  <div
    class="w-full flex flex-col sm:flex-row justify-center gap-4 sm:gap-2 sm:px-6 px-3 md:px-10 py-3 sm:py-4 md:py-5 overflow-hidden"
  >
    <SettingsSidebar
      class="hidden sm:flex"
      :currentTab="currentTab"
      @selectTab="(tab: SettingTabs) => (uiStore.currentSettingsTab = tab)"
    />
    <SettingsInlineSidebar
      class="flex sm:hidden"
      :currentTab="currentTab"
      @selectTab="(tab: SettingTabs) => (uiStore.currentSettingsTab = tab)"
    />
    <div
      class="max-w-2xl w-full grow flex flex-col gap-y-6 rounded-md overflow-y-auto custom-scrollbar px-2"
    >
      <SettingsGeneral v-if="currentTab === SettingTabs.PROFILE" />
      <SettingsSecurity v-if="currentTab === SettingTabs.SECURITY" />
      <SettingsAssistant v-if="currentTab === SettingTabs.ASSISTANT" />
      <SettingsSubscription v-if="currentTab === SettingTabs.PLANS" />
      <SettingsPayments v-if="currentTab === SettingTabs.PAYMENTS" />
    </div>
  </div>
</template>
