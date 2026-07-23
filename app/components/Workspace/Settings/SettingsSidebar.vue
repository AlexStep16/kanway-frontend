<script setup lang="ts">
import { CircleUserRound, LockKeyhole, Bot, CreditCard, Gem } from '@lucide/vue'
import { SettingTabs } from '~/enums/SettingTabs'

defineProps<{
  currentTab: SettingTabs
}>()

const emit = defineEmits<{
  (e: 'selectTab', tab: SettingTabs): void
}>()

const sections = [
  {
    label: 'АККАУНТ',
    tabs: [
      { id: SettingTabs.PROFILE, label: 'Профиль', icon: CircleUserRound },
      { id: SettingTabs.SECURITY, label: 'Безопасность', icon: LockKeyhole },
    ],
  },
  {
    label: 'ИИ-АССИСТЕНТ',
    tabs: [{ id: SettingTabs.ASSISTANT, label: 'Ассистент', icon: Bot }],
  },
  {
    label: 'ПОДПИСКА И ОПЛАТА',
    tabs: [
      { id: SettingTabs.PLANS, label: 'Тарифы', icon: Gem },
      { id: SettingTabs.PAYMENTS, label: 'Платежи', icon: CreditCard },
    ],
  },
]
</script>

<template>
  <div class="flex flex-col">
    <nav
      class="flex flex-col gap-y-1 p-1 bg-gray-100 rounded-md h-full sm:p-0 sm:bg-transparent sm:rounded-none sm:gap-y-4 w-auto sm:w-50"
    >
      <div
        v-for="section in sections"
        :key="section.label"
        class="flex flex-col gap-y-2"
      >
        <span class="text-xs text-gray-500 hidden sm:block">{{ section.label }}</span>

        <div class="flex flex-col gap-y-1">
          <button
            v-for="tab in section.tabs"
            :key="tab.id"
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-100"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === tab.id,
              'text-gray-500 hover:bg-gray-200': currentTab !== tab.id,
            }"
            @click="emit('selectTab', tab.id)"
          >
            <component
              :is="tab.icon"
              class="size-4.5"
            />
            <span class="hidden sm:inline">{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
