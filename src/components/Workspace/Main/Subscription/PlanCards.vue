<script setup lang="ts">
import { useSubscriptions } from '@/composables/subscriptions/queries/useSubscriptions'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import BlueCheck from '@assets/blueCheck.svg?component'
import SubscriptionButton from '../../Settings/Buttons/SubscriptionButton.vue'

defineProps<{
  isOneRow?: boolean
  isHeightIncreased?: boolean
}>()

const { isPending: isSubscriptionsLoading } = useSubscriptions()
</script>

<template>
  <div
    class="grid gap-2 grid-cols-1 md:grid-cols-2 grid-flow-row auto-rows-max"
    :class="{
      'md:grid-cols-3': isOneRow,
    }"
  >
    <template v-if="isSubscriptionsLoading">
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58"></div>
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58"></div>
      <div class="rounded-md bg-gray-300 grow animate-pulse h-58"></div>
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
            <div class="flex flex-col mt-1 gap-y-1 grow">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">1 рабочее пространство</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">5 досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">20 сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Обычная поддержка</span>
              </div>
            </div>

            <SubscriptionButton :plan="SubscriptionPlanEnum.Basic" />
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
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽599</span>
              /месяц
            </span>
            <div class="flex flex-col mt-1 gap-y-1 grow">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно пространств</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">300 сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Приоритетная поддержка</span>
              </div>
            </div>

            <SubscriptionButton :plan="SubscriptionPlanEnum.Premium" />
          </div>
        </div>
      </div>

      <div
        class="rounded-md bg-white border border-gray-200"
        :class="{ 'min-h-65': isHeightIncreased }"
      >
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col gap-y-1 size-full">
            <span class="text-sm font-medium text-gray-800">Бизнес</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽999</span>
              /месяц
            </span>
            <div class="flex flex-col mt-1 gap-y-1 grow">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно пространств</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <BlueCheck class="size-4" />
                <span class="text-xs">Приоритетная поддержка</span>
              </div>
            </div>

            <SubscriptionButton :plan="SubscriptionPlanEnum.Business" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
