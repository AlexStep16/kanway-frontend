<script setup lang="ts">
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import PlanCards from '../Main/Subscription/PlanCards.vue'
import CreditCards from '../Main/Subscription/CreditCards.vue'
import CurrentPlanCard from '../Main/Subscription/CurrentPlanCard.vue'

const { data: user } = useUser()

const { data: subscriptionsData } = useSubscriptions()

const subscriptions = computed(() => subscriptionsData.value || [])

const currentSubscription = computed(() => {
  if (!user.value) {
    return null
  }

  return (
    subscriptions.value.find(
      (subscription) => subscription.subscriptionId === user.value?.subscriptionId,
    ) || null
  )
})

const isBasicSubscription = computed(() => {
  if (!user.value) {
    return true
  }

  return user.value.subscriptionId === SubscriptionPlanEnum.Basic
})

const userCredits = computed(() => user.value?.credits ?? 0)
const userPaidCredits = computed(() => user.value?.paidCredits ?? 0)
const totalCredits = computed(() => userCredits.value + userPaidCredits.value)
</script>

<template>
  <div class="flex flex-col gap-y-5">
    <h3 class="text-lg font-bold text-gray-800">Тарифы</h3>
    <div class="flex flex-col gap-y-3">
      <h3 class="text-sm font-medium text-gray-800">Ваш тарифный план</h3>

      <div class="flex flex-col gap-y-2">
        <div
          v-if="isBasicSubscription"
          class="w-full rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 transition-all"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <!-- Инфо о тарифе -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2.5">
                <h3 class="text-lg font-bold tracking-tight text-zinc-900">Базовый</h3>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                >
                  <span class="size-1.5 rounded-full bg-emerald-500" />
                  Активен
                </span>
              </div>
              <p class="text-xs text-zinc-500">Бесплатный доступ со стандартными лимитами</p>
            </div>

            <!-- Стоимость и кнопка апгрейда -->
            <div
              class="flex flex-wrap items-center justify-between sm:justify-end gap-4 border-t border-zinc-100 pt-3 sm:border-0 sm:pt-0"
            >
              <div class="flex items-baseline gap-x-1 sm:text-right">
                <span class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                  0₽
                </span>
                <span class="text-sm font-medium text-zinc-400">/ навсегда</span>
              </div>
            </div>
          </div>
        </div>

        <CurrentPlanCard
          v-else-if="currentSubscription"
          :subscription="currentSubscription"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-3">
      <!-- Заголовок секции с краткой подсказкой -->
      <h3 class="text-sm font-semibold tracking-tight text-zinc-900">Ваш баланс кредитов</h3>

      <!-- Сетка метрик -->
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <!-- По подписке -->
        <div class="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-4">
          <div class="flex items-center justify-between gap-1 flex-wrap">
            <span class="text-xs font-medium text-zinc-500">По подписке</span>
            <span
              class="inline-flex items-center rounded-2xl bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600"
            >
              Сгорают
            </span>
          </div>
          <div class="mt-2 flex items-baseline gap-1.5">
            <span
              class="text-2xl font-extrabold tracking-tight"
              :class="userCredits <= 0 ? 'text-zinc-400' : 'text-zinc-900'"
            >
              {{ userCredits.toLocaleString('ru-RU') }}
            </span>
          </div>
        </div>

        <!-- Дополнительные / Оплаченные -->
        <div class="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-4">
          <div class="flex items-center justify-between gap-1 flex-wrap">
            <span class="text-xs font-medium text-zinc-500">Оплаченные</span>
            <span
              class="inline-flex items-center rounded-2xl bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700"
            >
              Бессрочные
            </span>
          </div>
          <div class="mt-2 flex items-baseline gap-1.5">
            <span
              class="text-2xl font-extrabold tracking-tight"
              :class="userPaidCredits <= 0 ? 'text-zinc-400' : 'text-zinc-900'"
            >
              {{ userPaidCredits.toLocaleString('ru-RU') }}
            </span>
          </div>
        </div>

        <!-- Всего (Акцентный блок) -->
        <div
          class="flex flex-col justify-between rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/50 to-indigo-50/30 p-4"
        >
          <span class="text-xs font-semibold text-blue-950">Доступно всего</span>
          <div class="mt-2 flex items-baseline gap-1.5">
            <span
              class="text-2xl font-black tracking-tight"
              :class="totalCredits <= 0 ? 'text-red-500' : 'text-primary'"
            >
              {{ totalCredits.toLocaleString('ru-RU') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-3">
      <h3 class="text-sm font-medium text-gray-800">Покупка кредитов</h3>

      <div class="flex flex-wrap lg:flex-nowrap gap-2">
        <CreditCards />
      </div>
    </div>

    <div class="flex flex-col gap-y-3">
      <h3 class="text-sm font-medium text-gray-800">Доступные планы</h3>

      <PlanCards class="grid-cols-1 sm:grid-cols-2" />
    </div>
  </div>
</template>
