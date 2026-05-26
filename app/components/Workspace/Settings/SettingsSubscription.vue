<script setup lang="ts">
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import dayjs from 'dayjs'
import PlanCards from '../Main/Subscription/PlanCards.vue'
import CreditCards from '../Main/Subscription/CreditCards.vue'
import { cn } from '~/lib/utils'

const { data: user } = useUser()

const { data: subscriptionsData } = useSubscriptions()

const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription()
const { mutate: resumeSubscription, isPending: isResuming } = useResumeSubscription()
const { mutate: downgradeCancelSubscription, isPending: isDowngradingCancel } =
  useDowngradeCancelSubscription()

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

const getSubscriptionUntil = computed(() => {
  if (!user.value || !user.value.subscriptionUntil) {
    return null
  }

  return dayjs(user.value.subscriptionUntil).format('DD.MM.YYYY')
})

function handleDowngradeCancelSubscription() {
  downgradeCancelSubscription()
}

function getPlanText(id: SubscriptionPlanEnum | undefined | null) {
  if (id === SubscriptionPlanEnum.Basic) {
    return 'Базовую'
  } else if (id === SubscriptionPlanEnum.Premium) {
    return 'Премиум'
  } else if (id === SubscriptionPlanEnum.Architector) {
    return 'Архитектор'
  }

  return ''
}

const isUserHasPending = computed(() => {
  return typeof user.value?.pendingChangePlan === 'number'
})

const userCredits = computed(() => user.value?.credits ?? 0)
const userPaidCredits = computed(() => user.value?.paidCredits ?? 0)
const totalCredits = computed(() => userCredits.value + userPaidCredits.value)
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Ваша текущая подписка
    </h3>

    <div class="flex flex-col gap-y-2">
      <div
        class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70"
        v-if="isBasicSubscription"
      >
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow gap-y-1">
            <span class="text-sm font-medium text-gray-800">Базовая</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">Бесплатно</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70"
        v-else-if="currentSubscription"
      >
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow gap-y-1">
            <div class="flex items-center justify-between w-full relative">
              <span class="text-sm font-medium text-gray-800">{{ currentSubscription.name }}</span>
              <span
                class="absolute right-0 text-xs text-green-500 py-1.5 px-2.5 bg-green-100 rounded-full"
                v-if="user?.isSubscriptionActive && !isUserHasPending"
              >
                Активна
              </span>
              <span
                class="absolute right-0 text-xs text-yellow-500 py-1.5 px-2.5 bg-yellow-100 rounded-full"
                v-else-if="isUserHasPending"
              >
                Переход на {{ getPlanText(user!.pendingChangePlan) }}
              </span>
              <span
                class="absolute right-0 text-xs text-red-500 py-1.5 px-2.5 bg-red-100 rounded-full"
                v-else
              >
                Отменена
              </span>
            </div>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold"
                >₽{{ currentSubscription.price }}</span
              >
              /месяц
            </span>
            <div class="flex flex-col text-gray-400 text-xs items-start">
              <span v-if="getSubscriptionUntil">Активна до: {{ getSubscriptionUntil }}</span>
              <span
                v-if="user?.isSubscriptionActive && user?.subscriptionUntil && !isUserHasPending"
                >Следующий платеж: {{ getSubscriptionUntil }}</span
              >
              <span v-else-if="isUserHasPending"
                >Переход на {{ getPlanText(user!.pendingChangePlan) }}:
                {{ getSubscriptionUntil }}</span
              >
              <div
                class="flex gap-x-1"
                v-if="user?.isSubscriptionActive"
              >
                <button
                  type="button"
                  class="text-xs text-red-500 rounded-md bg-red-100 py-1.5 px-2.5 mt-2 hover:bg-red-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none"
                  @click="cancelSubscription()"
                  :disabled="isCancelling"
                >
                  <Spinner
                    class="size-4 absolute"
                    v-if="isCancelling"
                  />
                  <span :class="{ 'opacity-0': isCancelling }">Отменить</span>
                </button>
                <button
                  type="button"
                  class="text-xs text-blue-500 relative flex items-center justify-center rounded-md bg-blue-100 py-1.5 px-2.5 mt-2 hover:bg-blue-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none"
                  v-if="isUserHasPending"
                  @click="handleDowngradeCancelSubscription()"
                  :disabled="isDowngradingCancel"
                >
                  <Spinner
                    class="size-4 absolute"
                    v-if="isDowngradingCancel"
                  />
                  <span :class="{ 'opacity-0': isDowngradingCancel }"
                    >Остаться на {{ getPlanText(user!.subscriptionId) }}</span
                  >
                </button>
              </div>
              <button
                type="button"
                class="text-xs text-blue-500 relative flex items-center justify-center rounded-md bg-blue-100 py-1.5 px-2.5 mt-2 hover:bg-blue-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none"
                v-else
                @click="resumeSubscription()"
                :disabled="isResuming"
              >
                <Spinner
                  class="size-4 absolute"
                  v-if="isResuming"
                />
                <span :class="{ 'opacity-0': isResuming }">Восстановить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Ваш баланс кредитов
    </h3>

    <div class="flex flex-col gap-y-2">
      <div class="rounded-md bg-white border border-gray-200 w-full">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center flex-col grow gap-y-1">
            <span class="text-sm font-medium text-gray-800"> Подписка </span>
            <span
              class="text-lg sm:text-xl text-primary font-bold"
              :class="
                cn('text-lg sm:text-xl text-primary font-bold', userCredits === 0 && 'text-red-500')
              "
            >
              {{ userCredits }}
            </span>
          </div>
          <div class="w-[0.5px] bg-gray-200 h-10"></div>
          <div class="flex items-center flex-col grow gap-y-1">
            <span class="text-sm font-medium text-gray-800">Оплаченные</span>
            <span
              :class="
                cn(
                  'text-lg sm:text-xl text-primary font-bold',
                  userPaidCredits === 0 && 'text-gray-800',
                )
              "
            >
              {{ userPaidCredits }}
            </span>
          </div>
          <div class="w-[0.5px] bg-gray-200 h-10"></div>
          <div class="flex items-center flex-col grow gap-y-1">
            <span class="text-sm font-medium text-gray-800">Всего</span>
            <span
              :class="
                cn(
                  'text-lg sm:text-xl text-primary font-bold',
                  totalCredits === 0 && 'text-red-500',
                )
              "
            >
              {{ totalCredits }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3 class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200">
      Покупка кредитов
    </h3>

    <div class="flex flex-wrap lg:flex-nowrap gap-2">
      <CreditCards />
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Доступные планы
    </h3>

    <PlanCards class="grid-cols-1 sm:grid-cols-2" />
  </div>
</template>
