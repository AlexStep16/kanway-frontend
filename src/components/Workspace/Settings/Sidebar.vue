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
    <nav class="flex flex-col gap-y-4 w-50">
      <div class="flex flex-col gap-y-2">
        <span class="text-xs text-gray-500">ОБЩИЕ НАСТРОЙКИ</span>

        <div class="flex flex-col gap-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-200"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.GENERAL,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.GENERAL,
            }"
            @click="emit('selectTab', SettingTabs.GENERAL)"
          >
            <CircleUserRound class="size-4" />
            <span>Профиль</span>
          </button>

          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-200"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.SECURITY,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.SECURITY,
            }"
            @click="emit('selectTab', SettingTabs.SECURITY)"
          >
            <Lock class="size-4" />
            <span>Безопасность</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <span class="text-xs text-gray-500">НАСТРОЙКА АССИСТЕНТА</span>

        <div class="flex flex-col gap-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-200"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.ASSISTANT,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.ASSISTANT,
            }"
            @click="emit('selectTab', SettingTabs.ASSISTANT)"
          >
            <Bot class="size-4" />
            <span>Ассистент</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2">
        <span class="text-xs text-gray-500">ПОДПИСКА И ПЛАТЕЖИ</span>

        <div class="flex flex-col gap-y-1">
          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-200"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200':
                currentTab === SettingTabs.SUBSCRIPTION,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.SUBSCRIPTION,
            }"
            @click="emit('selectTab', SettingTabs.SUBSCRIPTION)"
          >
            <Gem class="size-4" />
            <span>Подписка</span>
          </button>

          <button
            type="button"
            class="w-full flex items-center gap-x-2 py-2 px-2.5 text-sm font-medium rounded-lg focus:outline-hidden transition-colors duration-200"
            :class="{
              'bg-blue-100 text-blue-500 hover:bg-blue-200': currentTab === SettingTabs.PAYMENTS,
              'text-gray-500 hover:bg-gray-200': currentTab !== SettingTabs.PAYMENTS,
            }"
            @click="emit('selectTab', SettingTabs.PAYMENTS)"
          >
            <CreditCard class="size-4" />
            <span>Платежи</span>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>
