<script setup lang="ts">
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useAuthStore } from '@stores/auth'
import { useBoardDataStore } from '@stores/boardData'
import { useSettingDataStore } from '@stores/settingData'
import dayjs from 'dayjs'
import { computed, onMounted, toRef } from 'vue'
import CurrentSubscriptionButton from './Buttons/CurrentSubscriptionButton.vue'

const AUTH_STORE = useAuthStore()
const SETTING_STORE = useSettingDataStore()
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()

const user = toRef(AUTH_STORE, 'user')
const boardsCount = toRef(BOARD_STORE, 'boardsCount')
const isBoardsCountLoading = toRef(BOARD_STORE, 'isLoadingBoardsCount')

SETTING_STORE.loadSubscriptions()
BOARD_STORE.loadBoardsCount()

const currentSubscription = computed(() => {
  if (!user.value) {
    return null
  }

  return SETTING_STORE.getSubscriptionById(user.value.subscriptionId)
})

const isBasicSubscription = computed(() => {
  if (!user.value) {
    return true
  }

  return user.value.subscriptionId === SubscriptionPlanEnum.Basic
})

const isPremiumSubscription = computed(() => {
  if (!user.value) {
    return false
  }

  return user.value.subscriptionId === SubscriptionPlanEnum.Premium
})

const isBusinessSubscription = computed(() => {
  if (!user.value) {
    return false
  }

  return user.value.subscriptionId === SubscriptionPlanEnum.Business
})

const getSubscriptionUntil = computed(() => {
  if (!user.value || !user.value.subscriptionUntil) {
    return null
  }

  return dayjs(user.value.subscriptionUntil).format('DD.MM.YYYY')
})

const getNextPaymentDate = computed(() => {
  if (!user.value?.subscriptionUntil || !currentSubscription.value?.interval) {
    return null
  }

  return dayjs(user.value.subscriptionUntil)
    .add(1, currentSubscription.value.interval)
    .add(-1, 'day')
    .format('DD.MM.YYYY')
})

const getRemainingBoards = computed(() => {
  if (!currentSubscription.value || isBoardsCountLoading.value) {
    return 0
  }

  const maxBoards = currentSubscription.value.limitBoards
  if (maxBoards === -1) {
    return -1
  }

  return Math.max(0, maxBoards - boardsCount.value)
})

const getRemainingWorkspaces = computed(() => {
  if (!currentSubscription.value) {
    return 0
  }

  const maxWorkspaces = currentSubscription.value.limitWorkspaces
  if (maxWorkspaces === -1) {
    return -1
  }

  return Math.max(0, maxWorkspaces - WORKSPACE_STORE.workspaces.length)
})

const getRemainingMessages = computed(() => {
  if (!currentSubscription.value || !user.value) {
    return 0
  }

  const maxMessages = currentSubscription.value.limitAiMessagesPerMonth
  if (maxMessages === -1) {
    return -1
  }

  return Math.max(0, maxMessages - (user.value.generationsCount || 0))
})

onMounted(() => {
  window.HSStaticMethods.autoInit()
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
          <div class="flex flex-col grow-1 gap-y-1">
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
          <div class="flex flex-col grow-1 gap-y-1">
            <div class="flex items-center justify-between w-full relative">
              <span class="text-sm font-medium text-gray-800">{{ currentSubscription.name }}</span>
              <span
                class="absolute right-0 text-xs text-green-500 py-1.5 px-2.5 bg-green-100 rounded-full"
                v-if="user?.isSubscriptionActive"
              >
                Активна
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
              <span v-if="user?.isSubscriptionActive && getNextPaymentDate"
                >Следующий платеж: {{ getNextPaymentDate }}</span
              >
              <button
                type="button"
                class="text-xs text-red-500 rounded-md bg-red-100 py-1.5 px-2.5 mt-2 hover:bg-red-200 transition-colors duration-100"
                v-if="user?.isSubscriptionActive"
              >
                Отменить
              </button>

              <button
                type="button"
                class="text-xs text-blue-500 rounded-md bg-blue-100 py-1.5 px-2.5 mt-2 hover:bg-blue-200 transition-colors duration-100"
                v-else
              >
                Восстановить
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
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm text-gray-500">Пространств осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">{{
              getRemainingWorkspaces === -1 ? '∞' : getRemainingWorkspaces
            }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm text-gray-500">Досок осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">{{
              getRemainingBoards === -1 ? '∞' : getRemainingBoards
            }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white self-start border border-gray-200 w-full max-w-70">
        <div class="flex items-start justify-between p-3">
          <div class="flex flex-col grow-1 gap-y-1">
            <span class="text-sm text-gray-500">Сообщений осталось:</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">{{
              getRemainingMessages === -1 ? '∞' : getRemainingMessages
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

    <div class="grid gap-2 grid-cols-1 md:grid-cols-2 grid-flow-row auto-rows-max">
      <div class="rounded-md bg-white border border-gray-200 grow-1">
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Базовая</span>
            <span class="text-lg sm:text-xl text-gray-800 font-bold">Бесплатно</span>
            <div class="flex flex-col mt-1 gap-y-1 grow-1">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">1 рабочее пространство</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">5 досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">20 сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Обычная поддержка</span>
              </div>
            </div>

            <CurrentSubscriptionButton v-if="isBasicSubscription" />
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white border border-gray-200 grow-1">
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col size-full gap-y-1">
            <span class="text-sm font-medium text-gray-800">Премиум</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽599</span>
              /месяц
            </span>
            <div class="flex flex-col mt-1 gap-y-1 grow-1">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно пространств</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">300 сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Приоритетная поддержка</span>
              </div>
            </div>

            <button
              type="button"
              class="text-xs text-white p-2 w-full items-center gap-x-2 font-medium rounded-md mt-3 border border-transparent bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
              v-if="!isPremiumSubscription"
            >
              Повысить до Премиум
            </button>

            <CurrentSubscriptionButton v-else />
          </div>
        </div>
      </div>

      <div class="rounded-md bg-white border border-gray-200 grow-1">
        <div class="flex items-start justify-between p-3 size-full">
          <div class="flex flex-col gap-y-1 size-full">
            <span class="text-sm font-medium text-gray-800">Бизнес</span>
            <span class="text-sm text-gray-400">
              <span class="text-lg sm:text-xl text-gray-800 font-bold">₽999</span>
              /месяц
            </span>
            <div class="flex flex-col mt-1 gap-y-1 grow-1">
              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно пространств</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно досок</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно сообщений в месяц</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Неограниченно задач</span>
              </div>

              <div class="flex gap-x-1 text-gray-500 items-center">
                <svg
                  class="size-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  data-v-511ff0d3=""
                >
                  <title data-v-511ff0d3=""></title>
                  <path
                    d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4.71,7.71-5,5a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,12.59l4.29-4.3a1,1,0,0,1,1.42,1.42Z"
                    fill="#3b82f6"
                    data-v-511ff0d3=""
                  ></path>
                </svg>
                <span class="text-xs">Приоритетная поддержка</span>
              </div>
            </div>

            <button
              type="button"
              class="text-xs text-white p-2 w-full items-center gap-x-2 font-medium rounded-md mt-3 border border-transparent bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
              v-if="!isBusinessSubscription"
            >
              Повысить до Бизнес
            </button>

            <CurrentSubscriptionButton v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
