<script setup lang="ts">
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import dayjs from 'dayjs'
import { computed, onMounted } from 'vue'
import { useBoardsCount } from '@/composables/boards/queries/useBoardsCount'
import { useSubscriptions } from '@/composables/subscriptions/queries/useSubscriptions'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { useCancelSubscription } from '@/composables/payments/mutations/useCancelSubscription'
import Spinner from '@components/Loader/Spinner.vue'
import { useResumeSubscription } from '@/composables/payments/mutations/useResumeSubscription'
import { useDowngradeCancelSubscription } from '@/composables/payments/mutations/useDowngradeCancelSubscription'
import PlanCards from '../Main/Subscription/PlanCards.vue'
import { useUser } from '@/composables/auth/queries/useUser'
import { HSStaticMethods } from 'preline'

const { data: user } = useUser()

const { data: boardsCount, isLoading: isBoardsCountLoading } = useBoardsCount()
const { data: subscriptionsData } = useSubscriptions()
const { data: workspacesData } = useWorkspaces()

const { mutate: cancelSubscription, isPending: isCancelling } = useCancelSubscription()
const { mutate: resumeSubscription, isPending: isResuming } = useResumeSubscription()
const { mutate: downgradeCancelSubscription, isPending: isDowngradingCancel } =
  useDowngradeCancelSubscription()

const subscriptions = computed(() => subscriptionsData.value || [])
const workspaces = computed(() => workspacesData.value || [])

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

const getRemainingBoards = computed(() => {
  if (!currentSubscription.value || isBoardsCountLoading.value) {
    return 0
  }

  const maxBoards = currentSubscription.value.limitBoards
  if (maxBoards === -1) {
    return -1
  }

  return Math.max(0, maxBoards - (boardsCount.value ?? 0))
})

const getRemainingWorkspaces = computed(() => {
  if (!currentSubscription.value) {
    return 0
  }

  const maxWorkspaces = currentSubscription.value.limitWorkspaces
  if (maxWorkspaces === -1) {
    return -1
  }

  return Math.max(0, maxWorkspaces - workspaces.value.length)
})

const getRemainingCredits = computed(() => {
  if (!user.value) {
    return 0
  }

  return user.value.credits
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

onMounted(() => {
  HSStaticMethods.autoInit()
})
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
              <div class="flex gap-x-1" v-if="user?.isSubscriptionActive">
                <button
                  type="button"
                  class="text-xs text-red-500 rounded-md bg-red-100 py-1.5 px-2.5 mt-2 hover:bg-red-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none"
                  @click="cancelSubscription()"
                  :disabled="isCancelling"
                >
                  <Spinner class="size-4 absolute" v-if="isCancelling" />
                  <span :class="{ 'opacity-0': isCancelling }">Отменить</span>
                </button>
                <button
                  type="button"
                  class="text-xs text-blue-500 relative flex items-center justify-center rounded-md bg-blue-100 py-1.5 px-2.5 mt-2 hover:bg-blue-200 transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none"
                  v-if="isUserHasPending"
                  @click="handleDowngradeCancelSubscription()"
                  :disabled="isDowngradingCancel"
                >
                  <Spinner class="size-4 absolute" v-if="isDowngradingCancel" />
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
                <Spinner class="size-4 absolute" v-if="isResuming" />
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
      Текущие лимиты
    </h3>

    <div class="flex flex-wrap lg:flex-nowrap gap-2">
      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow gap-y-1">
            <span class="text-sm text-gray-500">Пространств осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">{{
              getRemainingWorkspaces === -1 ? '∞' : getRemainingWorkspaces
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-300 animate-pulse w-full max-w-70 h-19 rounded-md"
        v-if="isBoardsCountLoading"
      ></div>
      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70" v-else>
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow gap-y-1">
            <span class="text-sm text-gray-500">Досок осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">{{
              getRemainingBoards === -1 ? '∞' : getRemainingBoards
            }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow gap-y-1">
            <span class="text-sm text-gray-500">Кредитов осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">{{
              getRemainingCredits
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-y-2">
    <h3
      class="text-sm font-medium text-gray-800 pb-1 sm:pb-2 border-b border-gray-200 mt-2 sm:mt-4"
    >
      Доступные планы
    </h3>

    <PlanCards />
  </div>
</template>
