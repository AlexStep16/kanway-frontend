<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
</script>
<template>
  <SidebarInset>
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
    <div class="grow flex flex-col gap-y-4 ps-3 md:ps-6 pe-1 overflow-y-auto custom-scrollbar">
      <SettingsGeneral />
      <SettingsSecurity />
      <SettingsAssistant />
      <SettingsSubscription />
      <SettingsPayments />
    </div>
  </SidebarInset>
</template>
