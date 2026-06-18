<script setup lang="ts">
import WorkspaceView from '~/views/WorkspaceView.vue'

definePageMeta({
  authOnly: true,
  middleware: ['workspace'],
})

const uiStore = useUIStore()
const boardStore = useBoardStore()

const { activeBoardId } = storeToRefs(boardStore)

const isMainChat = computed(() => {
  return (activeBoardId.value === null && uiStore.isBoardTabSelected) || uiStore.isChatTabSelected
})

const isArchiveTabShown = computed(() => uiStore.isArchiveTabSelected)
const isChatTabShown = computed(
  () => uiStore.isChatOpen || uiStore.isChatTabSelected || activeBoardId.value === null,
)
</script>

<template>
  <SidebarProvider>
    <SidebarApp />

    <NuxtPage />

    <Archive
      class="transition-[flex] duration-300 min-w-0 overflow-hidden"
      :class="{
        grow: isArchiveTabShown,
        'grow-0 w-0 m-0! p-0! opacity-0': !isArchiveTabShown,
      }"
    />
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
