<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/stores/chat'
import { X, SquareArrowOutUpRight } from 'lucide-vue-next'
import { useUIStore } from '@/stores/ui'
import TitleChat from '../../Header/TitleChat.vue'

const uiStore = useUIStore()
const chatStore = useChatStore()
</script>

<template>
  <header class="w-full p-4 pb-0 flex flex-col gap-1">
    <div class="flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon-sm" aria-label="Open" @click="uiStore.selectChat()">
        <SquareArrowOutUpRight class="size-4" />
      </Button>
      <TitleChat />
      <Button variant="ghost" size="icon-sm" aria-label="Close" @click="chatStore.closeChat()">
        <X class="size-4.5" />
      </Button>
    </div>

    <div class="flex justify-center"></div>
  </header>
</template>
