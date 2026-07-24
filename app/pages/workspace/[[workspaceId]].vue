<script setup lang="ts">
import WorkspaceView from '~/views/WorkspaceView.vue'

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
</script>

<template>
  <SidebarProvider>
    <SidebarApp />

    <SidebarInset
      v-show="isWorkspaceContentShown"
      class="min-w-0 overflow-hidden"
    >
      <NuxtPage />

      <LazyArchive v-if="isArchiveTabShown" />

      <LazySettings v-if="isSettingsTabShown" />
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
