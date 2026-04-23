<script setup lang="ts">
import { CircleUserRound, Lock, Bot, CreditCard, Gem } from 'lucide-vue-next'
import { SettingTabs } from '@/enums/SettingTabs'

defineProps<{
  currentTab: SettingTabs
}>()

const emit = defineEmits<{
  (e: 'selectTab', tab: SettingTabs): void
}>()
</script>

<template>
  <div class="flex flex-col">
    <nav
      class="flex flex-col gap-y-1 p-1 bg-gray-100 rounded-md h-full sm:p-0 sm:bg-transparent sm:rounded-none sm:gap-y-4 w-auto sm:w-50"
    >
      <div class="flex flex-col gap-y-2">
        <span class="text-xs text-gray-500 hidden sm:block">ОБЩИЕ НАСТРОЙКИ</span>

        <div class="flex flex-col gap-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-100"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.GENERAL,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.GENERAL,
            }"
            @click="emit('selectTab', SettingTabs.GENERAL)"
          >
            <CircleUserRound class="size-4.5" />
            <span class="hidden sm:inline">Профиль</span>
          </button>

          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-100"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.SECURITY,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.SECURITY,
            }"
            @click="emit('selectTab', SettingTabs.SECURITY)"
          >
            <Lock class="size-4.5" />
            <span class="hidden sm:inline">Безопасность</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <span class="text-xs text-gray-500 hidden sm:block">НАСТРОЙКА АССИСТЕНТА</span>

        <div class="flex flex-col gap-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-100"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.ASSISTANT,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.ASSISTANT,
            }"
            @click="emit('selectTab', SettingTabs.ASSISTANT)"
          >
            <Bot class="size-4.5" />
            <span class="hidden sm:inline">Ассистент</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <span class="text-xs text-gray-500 hidden sm:block">ПОДПИСКА И ПЛАТЕЖИ</span>

        <div class="flex flex-col gap-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-100"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200':
                currentTab === SettingTabs.SUBSCRIPTION,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.SUBSCRIPTION,
            }"
            @click="emit('selectTab', SettingTabs.SUBSCRIPTION)"
          >
            <Gem class="size-4.5" />
            <span class="hidden sm:inline">Тарифы</span>
          </button>

          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-100"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.PAYMENTS,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.PAYMENTS,
            }"
            @click="emit('selectTab', SettingTabs.PAYMENTS)"
          >
            <CreditCard class="size-4.5" />
            <span class="hidden sm:inline">Платежи</span>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
