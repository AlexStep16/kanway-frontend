<script setup lang="ts">
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Progress from '@/components/ui/progress/Progress.vue'
import { computed } from 'vue'
import { useBoardsCount } from '@/composables/boards/queries/useBoardsCount'
import { useSubscriptions } from '@/composables/subscriptions/queries/useSubscriptions'
import { useWorkspaces } from '@/composables/workspaces/queries/useWorkspaces'
import { useUIStore } from '@/stores/ui'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Banknote } from 'lucide-vue-next'
import { useUser } from '@/composables/auth/queries/useUser'

const uiStore = useUIStore()

const { data: user } = useUser()

const { data: boardsCount, isLoading: isBoardsCountLoading } = useBoardsCount()
const { data: subscriptionsData, isPending: isSubscriptionsLoading } = useSubscriptions()
const { data: workspacesData } = useWorkspaces()

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

const maxBoards = computed(() => {
  if (!currentSubscription.value) {
    return 0
  }

  return currentSubscription.value.limitBoards
})

const maxWorkspaces = computed(() => {
  if (!currentSubscription.value) {
    return 0
  }

  return currentSubscription.value.limitWorkspaces
})

const boardsProgress = computed(() => {
  if (!currentSubscription.value || isBoardsCountLoading.value) {
    return 0
  }

  if (maxBoards.value === -1) {
    return 0
  }

  return Math.min(((boardsCount.value ?? 0) / maxBoards.value) * 100, 100)
})

const workspacesProgress = computed(() => {
  if (!currentSubscription.value) {
    return 0
  }

  if (maxWorkspaces.value === -1) {
    return 0
  }

  return Math.min((workspaces.value.length / maxWorkspaces.value) * 100, 100)
})

const userCredits = computed(() => user.value?.credits ?? 0)
const userPaidCredits = computed(() => user.value?.paidCredits ?? 0)
const totalCredits = computed(() => userCredits.value + userPaidCredits.value)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem class="cursor-default">
      <Card class="w-full shadow-none" v-if="!isSubscriptionsLoading && user">
        <CardHeader class="p-4 pb-3 flex-row items-center justify-between">
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground"> План </span>
            <CardTitle class="text-sm">{{ currentSubscription?.name || 'Базовый' }}</CardTitle>
          </div>
          <Button
            class="bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)]"
            size="xs"
            @click="uiStore.openPlansModal()"
          >
            Улучшить
          </Button>
        </CardHeader>
        <CardContent class="p-4 pt-0 flex flex-col gap-y-2">
          <div class="flex items-center gap-1 text-foreground mb-1">
            <Banknote class="size-4" />

            <span class="text-xs font-medium">
              Кредитов:
              <span
                class="font-medium text-primary"
                :class="{
                  'text-red-500': totalCredits === 0,
                }"
                >{{ totalCredits }}</span
              >
            </span>
          </div>
          <div class="flex flex-col gap-y-1" v-if="maxWorkspaces > 0">
            <span class="text-xs">
              <span class="font-medium text-primary">{{ workspaces.length }}</span> из
              {{ maxWorkspaces }} пространств
            </span>
            <Progress :model-value="workspacesProgress" class="w-full h-1" color="bg-primary" />
          </div>
          <div class="flex flex-col gap-y-1" v-if="maxBoards > 0">
            <span class="text-xs">
              <span class="font-medium text-primary">{{ boardsCount ?? 0 }}</span> из
              {{ maxBoards }} досок
            </span>
            <Progress :model-value="boardsProgress" class="w-full h-1" />
          </div>
        </CardContent>
      </Card>

      <Skeleton v-else class="w-full h-24" />
    </SidebarMenuItem>
  </SidebarMenu>
</template>
