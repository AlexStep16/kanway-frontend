<script setup lang="ts">
import { Settings } from '@lucide/vue'
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
    <div class="max-w-2xl w-full grow rounded-md overflow-y-auto custom-scrollbar px-2">
      <Suspense>
        <template #default>
          <div
            class="max-w-2xl w-full grow flex flex-col gap-y-6 rounded-md overflow-y-auto custom-scrollbar px-2"
            :key="currentTab"
          >
            <LazySettingsGeneral v-if="currentTab === SettingTabs.PROFILE" />
            <LazySettingsSecurity v-if="currentTab === SettingTabs.SECURITY" />
            <LazySettingsAssistant v-if="currentTab === SettingTabs.ASSISTANT" />
            <LazySettingsSubscription v-if="currentTab === SettingTabs.PLANS" />
            <LazySettingsPayments v-if="currentTab === SettingTabs.PAYMENTS" />
            <LazySettingsImport v-if="currentTab === SettingTabs.IMPORT" />
          </div>
        </template>

        <template #fallback>
          <div class="space-y-6 animate-pulse select-none">
            <div class="h-6 bg-zinc-200/80 w-1/3 rounded-lg animate-pulse" />

            <div class="space-y-4 pt-2">
              <div
                v-for="i in 3"
                :key="i"
                class="space-y-2"
              >
                <div class="h-4 bg-zinc-200/60 w-24 rounded-md animate-pulse" />
                <div
                  class="h-9 bg-zinc-100 w-full max-w-80 rounded-xl border border-zinc-200/40 animate-pulse"
                />
              </div>
            </div>

            <div class="h-9 bg-zinc-200/80 w-28 rounded-lg animate-pulse" />
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>
