<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'
import AIInput from '../Main/Chat/AIInput.vue'
import { useSendMessage } from '@/composables/chat/mutations/useSendMessage'
import { useChatMessages } from '@/composables/chatMessages/queries/useChatMessages'
import { useChatStore } from '@/stores/chat'
import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useChat } from '@/composables/chat/queries/useChat'
import Chat from '../Main/Chat/Chat.vue'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'

const { mutate: sendMessage, isPending: isMessageSending } = useSendMessage()

const chatStore = useChatStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { activeChat } = storeToRefs(chatStore)
const activeChatId = computed(() => activeChat.value?.id || null)
const activeChatWorkspaceId = computed(() => activeChat.value?.workspaceId || null)

const chat = useChat(activeChatId, activeChatWorkspaceId)

const { data: messages, isPending: areMessagesLoading } = useChatMessages(activeChatId)

const isLastMessageFromHuman = computed(() => {
  const lastMessage = messages.value?.at(-1) || null

  if (lastMessage && lastMessage.role === 'user') {
    return true
  } else return false
})

function send(message: string) {
  if (!message.trim() || isMessageSending.value) return

  sendMessage({
    payload: {
      message,
      boardId: activeBoardId.value || '',
      threadId: chat.value?.threadId || '',
      workspaceId: activeWorkspaceId.value || '',
    },
    chatId: chatStore.activeChat?.id ?? '',
  })
}
</script>

<template>
  <aside
    class="relative flex h-[calc(100svh-(--spacing(4)))] max-w-md overflow-y-auto overflow-x-hidden flex-1 flex-col bg-background m-2 ml-0 rounded-xl shadow"
  >
    <header class="p-4 pb-0 flex flex-col gap-1">
      <div class="flex items-center justify-between gap-2">
        <div class="size-5"></div>
        <h2 class="font-semibold">Новый чат</h2>
        <Button variant="ghost" size="icon-sm" aria-label="Close">
          <X class="size-4.5" />
        </Button>
      </div>

      <div class="flex justify-center"></div>
    </header>

    <main class="min-h-0 overflow-auto grow">
      <ScrollArea class="h-full p-4">
        <Chat v-if="activeChatId" />
      </ScrollArea>
    </main>

    <footer class="p-4">
      <AIInput @send="send" :is-last-message-from-human="isLastMessageFromHuman" />
    </footer>
  </aside>
</template>
