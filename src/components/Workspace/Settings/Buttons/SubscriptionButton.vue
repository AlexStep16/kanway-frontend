<script setup lang="ts">
import { useBuySubscription } from '@/composables/payments/mutations/useBuySubscription'
import { useDowngradeSubscription } from '@/composables/payments/mutations/useDowngradeSubscription'
import { useUpgradeSubscription } from '@/composables/payments/mutations/useUpgradeSubscription'
import { SubscriptionPlanEnum } from '@/enums/SubscriptionPlanEnum'
import { computed } from 'vue'
import Spinner from '@components/Loader/Spinner.vue'
import { useUser } from '@/composables/auth/queries/useUser'

const props = defineProps<{
  plan: SubscriptionPlanEnum
}>()

const { data: user } = useUser()

const { mutate: buySubscription, isPending: isBuying } = useBuySubscription()
const { mutate: downgradeSubscription, isPending: isDowngrading } = useDowngradeSubscription()
const { mutate: upgradeSubscription, isPending: isUpgrading } = useUpgradeSubscription()

function handleUpgradeSubscription() {
  if (user.value?.subscriptionId) {
    upgradeSubscription({
      subscriptionId: props.plan,
    })
  } else {
    buySubscription({
      subscriptionId: props.plan,
    })
  }
}

function handleDowngradeSubscription() {
  downgradeSubscription({
    subscriptionId: props.plan,
  })
}

const isCurrentSubscription = computed(() => {
  if (!user.value?.subscriptionId) return false
  return user.value.subscriptionId === props.plan
})

const isDowngrade = computed(() => {
  if (!user.value) return false

  const currentSubscriptionId = user.value.subscriptionId

  return currentSubscriptionId > props.plan
})

const isUpgrade = computed(() => {
  if (!user.value) return false

  const currentSubscriptionId = user.value.subscriptionId

  return currentSubscriptionId < props.plan
})

const isPendingSubscription = computed(() => {
  if (!user.value) return false
  return user.value.pendingChangePlan === props.plan
})

const isBasic = computed(() => props.plan === SubscriptionPlanEnum.Basic)

const planName = computed(() => {
  switch (props.plan) {
    case SubscriptionPlanEnum.Basic:
      return 'Базовой'
    case SubscriptionPlanEnum.Premium:
      return 'Премиум'
    case SubscriptionPlanEnum.Business:
      return 'Бизнес'
    default:
      return ''
  }
})
</script>

<template>
  <button
    type="button"
    class="text-xs text-blue-500 bg-blue-100 border font-medium border-blue-200 rounded-md p-2 w-full mt-3"
    v-if="isCurrentSubscription && (!isPendingSubscription || isBasic)"
  >
    Текущая подписка
  </button>

  <button
    type="button"
    class="text-xs relative text-white p-2 w-full flex items-center justify-center gap-x-2 font-medium rounded-md mt-3 border border-transparent bg-blue-500 disabled:opacity-50 disabled:pointer-events-none"
    v-else-if="isPendingSubscription"
  >
    Запланировано
  </button>

  <button
    type="button"
    class="text-xs relative text-white p-2 w-full flex items-center justify-center gap-x-2 font-medium rounded-md mt-3 border border-transparent bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)] disabled:opacity-50 disabled:pointer-events-none"
    v-else-if="isUpgrade"
    @click="handleUpgradeSubscription"
    :disabled="isUpgrading || isBuying"
  >
    <Spinner class="size-4 absolute" v-if="isUpgrading || isBuying" />
    <span :class="{ 'opacity-0': isUpgrading || isBuying }">Повысить до {{ planName }}</span>
  </button>

  <button
    type="button"
    class="text-xs relative text-blue-500 p-2 w-full flex items-center justify-center gap-x-2 font-medium rounded-md mt-3 bg-white border border-blue-500 hover:bg-blue-100 disabled:opacity-50 disabled:pointer-events-none"
    v-else-if="isDowngrade"
    @click="handleDowngradeSubscription"
    :disabled="isDowngrading"
  >
    <Spinner class="size-4 absolute" v-if="isDowngrading" />
    <span :class="{ 'opacity-0': isDowngrading }">Понизить до {{ planName }}</span>
  </button>
</template>
