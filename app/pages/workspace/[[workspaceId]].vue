<script setup lang="ts">
import WorkspaceView from '~/views/WorkspaceView.vue'

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})

const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const isMainChat = computed(() => activeBoardId.value === null && uiStore.isBoardTabSelected)

const isArchiveTabShown = computed(() => uiStore.isArchiveTabSelected)
const isSettingsTabShown = computed(() => uiStore.isSettingsTabSelected)
const isChatTabShown = computed(() => uiStore.isChatOpen || isMainChat.value)
</script>

<template>
  <SidebarProvider>
    <SidebarApp />

    <SidebarInset>
      <NuxtPage />

      <LazyArchive
        class="transition-[flex] duration-300 min-w-0 overflow-hidden"
        v-if="isArchiveTabShown"
      />

      <LazySettings
        class="transition-[flex] duration-300 min-w-0 overflow-hidden"
        v-if="isSettingsTabShown"
      />
    </SidebarInset>

    <Chat
      class="transition-[flex] duration-300 min-w-0 overflow-hidden"
      :class="{
        'grow lg:flex-[0_0_520px]': isChatTabShown && !isMainChat,
        'flex-1': isChatTabShown && isMainChat,
        'flex-[0_0_0px] opacity-0 pointer-events-none m-0!': !isChatTabShown,
      }"
    />
  </SidebarProvider>
  <WorkspaceView />
</template>
