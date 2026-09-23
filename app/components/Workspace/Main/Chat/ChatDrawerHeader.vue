<script setup lang="ts">
import { X } from '@lucide/vue'
import TitleChat from '../../Header/TitleChat.vue'

const chatStore = useChatStore()
</script>

<template>
  <header
    class="w-full px-4 py-2 flex flex-col gap-1 border-b border-zinc-200/70 bg-white/80 backdrop-blur-sm"
  >
    <div class="flex items-center justify-between">
      <TitleChat />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Close"
        @click="chatStore.closeChat()"
      >
        <X class="size-4.5 text-zinc-500" />
      </Button>
    </div>
  </header>
</template>
