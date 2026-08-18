<script setup lang="ts">
import WorkspaceView from '~/views/WorkspaceView.vue'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})

const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const isArchiveTabShown = computed(() => uiStore.isArchiveTabSelected)
const isSettingsTabShown = computed(() => uiStore.isSettingsTabSelected)
const isMainChat = computed(() => activeBoardId.value === null && uiStore.isBoardTabSelected)
const isChatTabShown = computed(() => uiStore.isChatOpen || isMainChat.value)
const isWorkspaceContentShown = computed(() => !isMainChat.value)

const { data: user } = useUser()
const { mutate: buySubscription } = useBuySubscription()
const { mutate: upgradeSubscription } = useUpgradeSubscription()
const { mutate: downgradeSubscription } = useDowngradeSubscription()

const pendingSelectedPlan = ref<SubscriptionPlanEnum | null>(null)

onMounted(() => {
  const selectedPlan = localStorage.getItem(SELECTED_PLAN_STORAGE_KEY)
  if (selectedPlan === null) return

  localStorage.removeItem(SELECTED_PLAN_STORAGE_KEY)
  pendingSelectedPlan.value = Number(selectedPlan)
})

watch(
  [user, pendingSelectedPlan],
  ([currentUser, plan]) => {
    if (!currentUser || plan === null) return

    pendingSelectedPlan.value = null

    if (currentUser.subscriptionId === plan) return

    if (currentUser.subscriptionId > plan) {
      downgradeSubscription({ subscriptionId: plan })
    } else if (currentUser.subscriptionId) {
      upgradeSubscription({ subscriptionId: plan })
    } else {
      buySubscription({ subscriptionId: plan })
    }
  },
  { immediate: true },
)
</script>

<template>
  <SidebarProvider>
    <SidebarApp />

    <SidebarInset
      v-show="isWorkspaceContentShown"
      class="min-w-0 overflow-hidden"
    >
      <NuxtPage />

      <Suspense v-if="isArchiveTabShown">
        <template #default>
          <LazyArchive />
        </template>

        <template #fallback>
          <ArchiveSkeleton />
        </template>
      </Suspense>
      <Suspense v-if="isSettingsTabShown">
        <template #default>
          <LazySettings />
        </template>

        <template #fallback>
          <SettingsSkeleton />
        </template>
      </Suspense>
    </SidebarInset>

    <Chat
      v-show="isChatTabShown"
      class="min-w-0 overflow-hidden"
      :class="{
        'grow lg:flex-[0_0_520px]': !isMainChat,
        'flex-1': isMainChat,
      }"
    />
  </SidebarProvider>
  <WorkspaceView />
</template>
