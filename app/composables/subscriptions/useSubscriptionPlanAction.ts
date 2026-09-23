import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'

export const SELECTED_PLAN_STORAGE_KEY = 'selectedPlan'

export function useSubscriptionPlanAction(plan: MaybeRefOrGetter<SubscriptionPlanEnum>) {
  const { data: user } = useUser()

  const { mutate: buySubscription, isPending: isBuying } = useBuySubscription()
  const { mutate: downgradeSubscription, isPending: isDowngrading } = useDowngradeSubscription()
  const { mutate: upgradeSubscription, isPending: isUpgrading } = useUpgradeSubscription()

  const planValue = computed(() => toValue(plan))

  const isGuest = computed(() => !user.value)

  function handleGuestClick() {
    localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, planValue.value.toString())
    navigateTo('/auth')
  }

  function handleUpgradeSubscription() {
    if (user.value?.subscriptionId) {
      upgradeSubscription({
        subscriptionId: planValue.value,
      })
    } else {
      buySubscription({
        subscriptionId: planValue.value,
      })
    }
  }

  function handleDowngradeSubscription() {
    downgradeSubscription({
      subscriptionId: planValue.value,
    })
  }

  const isCurrentSubscription = computed(() => {
    if (!user.value) return false
    return user.value.subscriptionId === planValue.value
  })

  const isDowngrade = computed(() => {
    if (!user.value) return false

    return user.value.subscriptionId > planValue.value
  })

  const isUpgrade = computed(() => {
    if (!user.value) return false

    return user.value.subscriptionId < planValue.value
  })

  const isPendingSubscription = computed(() => {
    if (!user.value) return false
    return user.value.pendingChangePlan === planValue.value
  })

  const isBasic = computed(() => planValue.value === SubscriptionPlanEnum.Basic)

  const planName = computed(() => {
    switch (planValue.value) {
      case SubscriptionPlanEnum.Basic:
        return 'Базовый'
      case SubscriptionPlanEnum.Premium:
        return 'Премиум'
      case SubscriptionPlanEnum.Architector:
        return 'Архитектор'
      default:
        return ''
    }
  })

  const guestButtonText = computed(() => {
    switch (planValue.value) {
      case SubscriptionPlanEnum.Basic:
        return 'Начать бесплатно'
      case SubscriptionPlanEnum.Premium:
        return 'Оформить подписку'
      case SubscriptionPlanEnum.Architector:
        return 'Перейти на Архитектор'
      default:
        return ''
    }
  })

  return {
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
  }
}
