<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/stores/chat'
import { X, SquareArrowOutUpRight, MessageCircle } from 'lucide-vue-next'
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import Title from '../../Header/Title.vue'
import { useUpdateChat } from '@/composables/chat/mutations/useUpdateChat'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import { useChat } from '@/composables/chat/queries/useChat'

const { mutate: updateChat, isPending: isUpdatingChat } = useUpdateChat()

const uiStore = useUIStore()
const chatStore = useChatStore()

const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)
const { activeChatId } = storeToRefs(chatStore)

const { data: activeChat, isPending: isChatLoading } = useChat(activeChatId, activeWorkspaceId)

const activeChatName = computed(() => activeChat.value?.name || 'Без названия')

function handleUpdateChatName(newName: string) {
  if (activeChatId.value) {
    updateChat({
      id: activeChatId.value,
      payload: { name: newName },
    })
  }
}
</script>

<template>
  <header class="w-full p-4 pb-0 flex flex-col gap-1">
    <div class="flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon-sm" aria-label="Open" @click="uiStore.selectChat()">
        <SquareArrowOutUpRight class="size-4" />
      </Button>
      <Title
        :initial-name="activeChatName"
        :is-loading="isChatLoading"
        :is-busy="isUpdatingChat"
        @update-name="handleUpdateChatName"
      >
        <MessageCircle class="size-4" />
      </Title>
      <Button variant="ghost" size="icon-sm" aria-label="Close" @click="chatStore.closeChat()">
        <X class="size-4.5" />
      </Button>
    </div>

    <div class="flex justify-center"></div>
  </header>
</template>
