<script setup lang="ts">
import dayjs from 'dayjs'
import type { ISubscription } from '~/interfaces/domain/ISubscription'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

const props = defineProps<{
  subscription: ISubscription
}>()

const { data: user } = useUser()

const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription()
const { mutate: resumeSubscription, isPending: isResuming } = useResumeSubscription()
const { mutate: downgradeCancelSubscription, isPending: isDowngradingCancel } =
  useDowngradeCancelSubscription()

const isUserHasPending = computed(() => typeof user.value?.pendingChangePlan === 'number')
const isUserHasPaymentMethod = computed(() => !!user.value?.paymentMethodId)

const subscriptionUntilLabel = computed(() => {
  if (!user.value?.subscriptionUntil) return null
  return dayjs(user.value.subscriptionUntil).format('DD.MM.YYYY')
})

function getPlanText(id: SubscriptionPlanEnum | undefined | null) {
  if (id === SubscriptionPlanEnum.Basic) return 'Базовый'
  if (id === SubscriptionPlanEnum.Premium) return 'Премиум'
  if (id === SubscriptionPlanEnum.Architector) return 'Архитектор'
  return ''
}

const statusConfig = computed(() => {
  if (isUserHasPending.value) {
    return {
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
      label: `Смена на «${getPlanText(user.value?.pendingChangePlan)}»`,
    }
  }

  if (user.value?.isAutoRenewEnabled) {
    return {
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      label: 'Активен',
    }
  }

  return {
    dotClass: 'bg-zinc-400',
    badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-200/60',
    label: 'Автопродление выключено',
  }
})

const isSwitchPending = computed(() => isCancelling.value || isResuming.value)

const disabledReason = computed(() => {
  if (!isUserHasPaymentMethod.value) {
    return 'Добавьте способ оплаты, чтобы включить автопродление'
  }

  return null
})

function toggleAutoRenew() {
  if (isSwitchPending.value) return

  if (user.value?.isAutoRenewEnabled) {
    cancelSubscription()
  } else {
    resumeSubscription()
  }
}
</script>

<template>
  <div
    class="w-full rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 transition-all available-plans"
  >
    <!-- Верхняя секция: Название тарифа, статус и цена -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 class="text-lg font-bold tracking-tight text-zinc-900">
            {{ props.subscription.name }}
          </h3>
          <span
            class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
            :class="statusConfig.badgeClass"
          >
            <span
              class="size-1.5 rounded-full shrink-0"
              :class="statusConfig.dotClass"
            />
            {{ statusConfig.label }}
          </span>
        </div>
      </div>

      <!-- Цена -->
      <div class="sm:text-right">
        <div class="flex items-baseline gap-x-1">
          <span class="text-3xl font-extrabold tracking-tight text-zinc-900">
            {{ props.subscription.price }}₽
          </span>
          <span class="text-sm font-medium whitespace-nowrap text-zinc-400">/ мес.</span>
        </div>
      </div>
    </div>

    <!-- Разделитель -->
    <div class="my-5 border-t border-zinc-100" />

    <!-- Нижняя секция: Детали и контрол автопродления -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <!-- Информация о сроках -->
      <div class="flex items-center gap-3 text-sm">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500"
        >
          <svg
            class="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <span class="block text-xs font-medium text-zinc-400">
            {{ user?.isAutoRenewEnabled ? 'Следующее списание' : 'Активна до' }}
          </span>
          <span class="font-semibold text-zinc-800">
            {{ subscriptionUntilLabel ?? 'Бессрочно' }}
          </span>
        </div>
      </div>

      <!-- Переключатель автопродления -->
      <div
        class="flex items-center justify-between sm:justify-end gap-x-3 bg-zinc-50/70 sm:bg-transparent p-3 sm:p-0 rounded-xl"
      >
        <div class="flex flex-col sm:text-right">
          <span class="text-xs font-semibold text-zinc-700 leading-tight">Автопродление</span>
          <span class="text-[11px] text-zinc-400">
            {{ user?.isAutoRenewEnabled ? 'Списание в конце срока' : 'Подписка завершится' }}
          </span>
        </div>

        <TooltipProvider :disableHoverableContent="true">
          <Tooltip :delayDuration="200">
            <TooltipTrigger as-child>
              <!-- Wrapper span keeps hover working while the button inside is disabled -->
              <span
                class="inline-flex"
                tabindex="0"
              >
                <button
                  type="button"
                  role="switch"
                  :aria-checked="user?.isAutoRenewEnabled"
                  :disabled="isSwitchPending || !isUserHasPaymentMethod"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="user?.isAutoRenewEnabled ? 'bg-primary' : 'bg-zinc-200'"
                  @click="toggleAutoRenew"
                >
                  <!-- Спиннер загрузки внутри тоггла -->
                  <span
                    v-if="isSwitchPending"
                    class="absolute inset-0 flex items-center justify-center text-white"
                  >
                    <svg
                      class="size-3 animate-spin text-zinc-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  </span>

                  <span
                    v-else
                    class="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
                    :class="user?.isAutoRenewEnabled ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </span>
            </TooltipTrigger>
            <TooltipContent v-if="disabledReason">
              {{ disabledReason }}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>

    <!-- Плашка отложенной смены тарифа (если есть) -->
    <div
      v-if="isUserHasPending"
      class="mt-4 flex flex-col gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 p-3.5 sm:flex-row sm:items-center sm:justify-between text-xs"
    >
      <div class="flex items-center gap-2.5 text-amber-900">
        <svg
          class="size-4 shrink-0 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          С <strong>{{ subscriptionUntilLabel }}</strong> тариф изменится на
          <strong>«{{ getPlanText(user?.pendingChangePlan) }}»</strong>
        </span>
      </div>

      <button
        type="button"
        class="self-start sm:self-auto shrink-0 font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2 transition-colors cursor-pointer disabled:opacity-50"
        :disabled="isDowngradingCancel"
        @click="downgradeCancelSubscription()"
      >
        <span v-if="isDowngradingCancel">Отменяем...</span>
        <span v-else>Остаться на «{{ props.subscription.name }}»</span>
      </button>
    </div>
  </div>
</template>
