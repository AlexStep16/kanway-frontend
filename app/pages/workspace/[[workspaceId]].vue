<script setup lang="ts">
import WorkspaceView from '~/views/WorkspaceView.vue'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import Sparkles from '~/assets/sparkles.svg?skipsvgo'

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})

const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const isArchiveTabShown = computed(() => uiStore.isArchiveTabSelected)
const isSettingsTabShown = computed(() => uiStore.isSettingsTabSelected)

const { data: user } = useUser()
const { mutate: buySubscription } = useBuySubscription()
const { mutate: upgradeSubscription } = useUpgradeSubscription()
const { mutate: downgradeSubscription } = useDowngradeSubscription()

const isMobile = useMediaQuery('(max-width: 768px)')

const isBoardEmpty = computed(() => activeBoardId.value === null)
const isWorkspaceContentShown = computed(() => {
  if (uiStore.isChatFullscreen) return false

  if (isArchiveTabShown.value || isSettingsTabShown.value) return true

  if (isBoardEmpty.value) return false

  return true
})

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
      class="min-w-0 flex-1 overflow-hidden"
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

    <Chat />
  </SidebarProvider>

  <button
    v-if="isMobile && !isBoardEmpty && !uiStore.isChatOpen"
    @click="uiStore.selectChat()"
    class="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full bg-primary/75 text-white shadow-xl active:scale-95 transition-transform"
  >
    <Sparkles class="size-5" />
  </button>

  <WorkspaceView />
</template>
