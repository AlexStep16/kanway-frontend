<script setup lang="ts">
import dayjs from 'dayjs'
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
  user,
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

const isDowngradeConfirmOpen = ref(false)

const pendingDate = computed(() =>
  user.value?.subscriptionUntil ? dayjs(user.value.subscriptionUntil).format('DD.MM.YYYY') : null,
)

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

  <div
    v-else-if="isPendingSubscription"
    class="flex flex-col items-center"
  >
    <button
      type="button"
      class="relative w-full flex items-center justify-center gap-1 font-medium rounded-md border border-transparent"
      :class="[
        sizeClasses,
        'text-white bg-blue-500 disabled:opacity-50 disabled:pointer-events-none',
      ]"
    >
      Запланировано на

      <span
        v-if="pendingDate"
        class="text-gray-200"
        >{{ pendingDate }}</span
      >
    </button>
  </div>

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
    @click="isDowngradeConfirmOpen = true"
    :disabled="isDowngrading"
  >
    <Spinner
      class="size-4 absolute"
      v-if="isDowngrading"
    />
    <span :class="{ 'opacity-0': isDowngrading }">Перейти на {{ planName }}</span>
  </button>

  <AlertDialog
    :open="isDowngradeConfirmOpen"
    @update:open="(val) => (isDowngradeConfirmOpen = val)"
  >
    <AlertDialogContent
      class="max-w-sm p-0 overflow-hidden border-none shadow-2xl rounded-xl gap-0"
    >
      <div class="p-6">
        <AlertDialogHeader class="space-y-3 text-center">
          <AlertDialogTitle class="text-xl font-bold tracking-tight text-foreground m-0">
            Понижение тарифа
          </AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-muted-foreground">
            Вы уверены, что хотите перейти на тариф
            <span class="font-medium text-foreground">{{ planName }}</span
            >? Переход произойдёт в конце текущего расчётного периода<template v-if="pendingDate">
              — <span class="font-medium text-foreground">{{ pendingDate }}</span></template
            >. Вы потеряете доступ к расширенным функциям и лимиты будут изменены.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>

      <div class="border-t border-border bg-muted/30 px-6 py-4">
        <AlertDialogFooter class="flex-row gap-3 sm:justify-center">
          <AlertDialogCancel
            @click="isDowngradeConfirmOpen = false"
            class="mt-0 flex-1 bg-background hover:bg-accent border-border"
          >
            Отмена
          </AlertDialogCancel>

          <AlertDialogAction
            @click="
              () => {
                isDowngradeConfirmOpen = false
                handleDowngradeSubscription()
              }
            "
            class="flex-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            Подтвердить
          </AlertDialogAction>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
