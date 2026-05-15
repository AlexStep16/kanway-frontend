<script setup lang="ts">
import { X, SquareArrowOutUpRight } from 'lucide-vue-next'
import TitleChat from '../../Header/TitleChat.vue'

const uiStore = useUIStore()
const chatStore = useChatStore()

const isMobile = useMediaQuery('(max-width: 768px)')
</script>

<template>
  <header class="w-full p-4 pb-0 flex flex-col gap-1">
    <div class="flex items-center justify-between gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Open"
        @click="uiStore.selectChat()"
        v-if="!isMobile"
      >
        <SquareArrowOutUpRight class="size-4" />
      </Button>
      <SidebarTrigger class="-ml-1" v-else />
      <TitleChat />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Close"
        @click="chatStore.closeChat()"
        v-if="!isMobile"
      >
        <X class="size-4.5" />
      </Button>
      <div class="size-8" v-else></div>
    </div>

    <div class="flex justify-center"></div>
  </header>
</template>
