<script setup lang="ts">
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { Check, X } from '@lucide/vue'
import SettingsSubscriptionButton from '../../Settings/Buttons/SettingsSubscriptionButton.vue'

defineProps<{
  isHeightIncreased?: boolean
}>()

const { isPending: isSubscriptionsLoading } = useSubscriptions()
</script>

<template>
  <div class="grid gap-2 grid-flow-row auto-rows-max w-full">
    <template v-if="isSubscriptionsLoading">
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58 w-40"></div>
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58 w-40"></div>
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58 w-40"></div>
    </template>
    <template v-else>
      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Базовая</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">Бесплатно</span>
            <ul class="space-y-2 text-xs text-left grow">
              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 1 пространство </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 5 досок </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 200 кредитов </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Базовая модель: <b>GPT 5.4 Mini</b> </span>
              </li>

              <li class="flex items-center gap-x-1">
                <X class="size-3.5 text-red-600 shrink-0" />
                <span class="text-gray-500"> Доступ к моделям <b>GPT 5.4, GPT 5.5</b> </span>
              </li>
            </ul>

            <SettingsSubscriptionButton :plan="SubscriptionPlanEnum.Basic" />
          </div>
        </div>
      </div>

      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Премиум</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽999</span>
              /месяц
            </span>
            <ul class="space-y-2 text-xs text-left grow">
              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 5 пространств </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 20 досок </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 10000 кредитов </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Приоритетная поддержка </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Доступ к моделям <b>GPT 5.4, GPT 5.5</b> </span>
              </li>
            </ul>

            <SettingsSubscriptionButton :plan="SubscriptionPlanEnum.Premium" />
          </div>
        </div>
      </div>

      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col gap-y-1 size-full">
            <span class="text-sm font-medium text-gray-800">Архитектор</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽2499</span>
              /месяц
            </span>
            <ul class="space-y-2 text-xs text-left grow">
              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Неограниченно пространств </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Неограниченно досок </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> 25000 кредитов </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Приоритетная поддержка </span>
              </li>

              <li class="flex items-center gap-x-1">
                <Check class="size-3.5 text-blue-600 shrink-0" />
                <span class="text-gray-500"> Доступ к моделям <b>GPT 5.4, GPT 5.5</b> </span>
              </li>
            </ul>

            <SettingsSubscriptionButton :plan="SubscriptionPlanEnum.Architector" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
