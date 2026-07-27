<script setup lang="ts">
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'

const props = withDefaults(
  defineProps<{
    plan: SubscriptionPlanEnum
    size?: 'sm' | 'lg'
    /** Renders the guest CTA as a bold primary button (e.g. the recommended plan on the landing page). */
    highlight?: boolean
  }>(),
  {
    size: 'sm',
    highlight: false,
  },
)

const {
  isGuest,
  isCurrentSubscription,
  isDowngrade,
  isUpgrade,
  isPendingSubscription,
  isBasic,
  planName,
  guestButtonText,
  isBuying,
  isUpgrading,
  isDowngrading,
  handleGuestClick,
  handleUpgradeSubscription,
  handleDowngradeSubscription,
} = useSubscriptionPlanAction(() => props.plan)

const sizeClasses = computed(() =>
  props.size === 'lg' ? 'mt-5 py-3 px-4 text-sm' : 'mt-3 p-2 text-xs',
)

const guestClasses = computed(() => {
  if (props.highlight) {
    return 'text-white bg-primary hover:bg-blue-700 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:pointer-events-none'
  }

  return 'text-gray-800 bg-white border border-gray-200 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none'
})
</script>

<template>
  <button
    type="button"
    class="w-full flex items-center justify-center font-medium rounded-md"
    :class="[sizeClasses, guestClasses]"
    v-if="isGuest"
    @click="handleGuestClick"
  >
    {{ guestButtonText }}
  </button>

  <button
    type="button"
    class="w-full flex items-center justify-center font-medium rounded-md"
    :class="[sizeClasses, 'text-blue-500 bg-blue-100 border border-blue-200']"
    v-else-if="isCurrentSubscription && (!isPendingSubscription || isBasic)"
  >
    Текущая подписка
  </button>

  <button
    type="button"
    class="relative w-full flex items-center justify-center gap-x-2 font-medium rounded-md border border-transparent"
    :class="[
      sizeClasses,
      'text-white bg-blue-500 disabled:opacity-50 disabled:pointer-events-none',
    ]"
    v-else-if="isPendingSubscription"
  >
    Запланировано
  </button>

  <button
    type="button"
    class="relative w-full flex items-center justify-center gap-x-2 font-medium rounded-md border border-transparent text-white bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
    :class="sizeClasses"
    v-else-if="isUpgrade"
    @click="handleUpgradeSubscription"
    :disabled="isUpgrading || isBuying"
  >
    <Spinner
      class="size-4 absolute"
      v-if="isUpgrading || isBuying"
    />
    <span :class="{ 'opacity-0': isUpgrading || isBuying }">Повысить до {{ planName }}</span>
  </button>

  <button
    type="button"
    class="relative w-full flex items-center justify-center gap-x-2 font-medium rounded-md bg-white border border-blue-500 text-blue-500 hover:bg-blue-100 disabled:opacity-50 disabled:pointer-events-none"
    :class="sizeClasses"
    v-else-if="isDowngrade"
    @click="handleDowngradeSubscription"
    :disabled="isDowngrading"
  >
    <Spinner
      class="size-4 absolute"
      v-if="isDowngrading"
    />
    <span :class="{ 'opacity-0': isDowngrading }">Перейти на {{ planName }}</span>
  </button>
</template>
