<script setup lang="ts">
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import UserBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/UserBubbleSkeleton.vue'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AIBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/AIBubbleSkeleton.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useChat } from '@/composables/chat/queries/useChat'
import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { useRetryAgent } from '@/composables/chat/mutations/useRetryAgent'
import { useChatMessages } from '@/composables/chatMessages/queries/useChatMessages'
import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import ChatLog from './ChatLog.vue'
import ChatAmbiguous from './ChatAmbiguous.vue'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import ChatDisplay from './ChatDisplay.vue'
import ChatThinking from './ChatThinking.vue'
import { useSendMessage } from '@/composables/chat/mutations/useSendMessage'
import AIInput from './AIInput.vue'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'
import Error from './Bubbles/Error.vue'

const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { activeChat } = storeToRefs(chatStore)

const activeChatId = computed(() => activeChat.value?.id || null)
const activeChatWorkspaceId = computed(() => activeChat.value?.workspaceId || null)
const messagesRef = ref<HTMLDivElement | null>(null)

const chat = useChat(activeChatId, activeChatWorkspaceId)

const { data: messages, isPending: areMessagesLoading } = useChatMessages(activeChatId)
const { mutate: sendMessage, isPending: isMessageSending, isError } = useSendMessage()

const { mutate: retryAgent } = useRetryAgent()
const { mutate: stopAgent } = useStopAgent()

function handleRetryAgent(messageId: string) {
  retryAgent({
    payload: {
      chatId: activeChatId.value || '',
      threadId: chat.value?.threadId || '',
      chatMessageId: messageId,
      boardId: activeBoardId.value || '',
      workspaceId: activeWorkspaceId.value || '',
    },
    chatId: chatStore.activeChat?.id ?? '',
  })
}

const getFormattedDate = (date: Date) => {
  return dayjs(date).calendar() + ' в ' + dayjs(date).format('HH:mm')
}

function stopActiveAgent() {
  if (chat.value && agentStatusStore.isSSEActive()) {
    stopAgent({
      chatId: chat.value.id,
      threadId: chat.value.threadId,
    })
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', stopActiveAgent)
})

onBeforeUnmount(() => {
  stopActiveAgent()
  window.removeEventListener('beforeunload', stopActiveAgent)
})

const reversedMessages = computed(() => {
  return [...(messages.value || [])].reverse()
})

const isTemporaryChat = computed(() => {
  return chatStore.activeChat?.id === chatStore.temporaryChatId
})

function send(message: string) {
  if (!message.trim() || isMessageSending.value || !activeChatId.value) return

  sendMessage({
    payload: {
      message,
      boardId: activeBoardId.value || '',
      threadId: chat.value?.threadId || '',
      workspaceId: activeWorkspaceId.value || '',
    },
    chatId: activeChatId.value,
  })

  if (messagesRef.value) {
    setTimeout(() => {
      messagesRef.value?.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }, 100)
  }
}

function sendAgain() {
  const lastHumanMessage = reversedMessages.value.find((msg) => msg.role === 'user')

  if (lastHumanMessage) {
    send(lastHumanMessage.content)
  }
}

const activeChatName = computed(() => {
  return activeChat.value?.name || 'Новый чат'
})

const isLastMessageSteps = computed(() => {
  const lastMessage = messages.value?.at(-1) || null

  if (lastMessage && lastMessage.role === 'steps') {
    return true
  } else return false
})
</script>

<template>
  <aside
    class="relative flex h-[calc(100svh-(--spacing(4)))] max-w-115 overflow-y-auto overflow-x-hidden flex-1 flex-col bg-background m-2 ml-0 rounded-xl shadow"
  >
    <header class="p-4 pb-0 flex flex-col gap-1">
      <div class="flex items-center justify-between gap-2">
        <div class="size-5"></div>
        <h2 class="font-semibold truncate max-w-70">{{ activeChatName }}</h2>
        <Button variant="ghost" size="icon-sm" aria-label="Close" @click="chatStore.closeChat()">
          <X class="size-4.5" />
        </Button>
      </div>

      <div class="flex justify-center"></div>
    </header>

    <main class="min-h-0 overflow-hidden grow">
      <div
        class="flex flex-col-reverse overflow-y-auto overflow-x-hidden gap-2 min-h-0 max-h-full py-6 px-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
        ref="messagesRef"
      >
        <template v-if="!areMessagesLoading">
          <AIBubble v-if="isError" :isError="true" @tryAgain="sendAgain">
            <Error />
          </AIBubble>

          <template v-for="message in reversedMessages" :key="message.id">
            <UserBubble
              v-if="message.role === 'user'"
              :text="message.content"
              :date="getFormattedDate(message.createdAt)"
            />

            <ChatThinking v-else-if="message.role === 'steps'" :steps="message.content" />

            <template v-else-if="message.role === CustomEventsEnum.OPERATION">
              <ChatLog :message="message" />
            </template>

            <template v-else-if="message.role === CustomEventsEnum.DISPLAY">
              <ChatDisplay :message="message" />
            </template>

            <template v-else-if="message.role === CustomEventsEnum.AMBIGUOUS">
              <ChatAmbiguous :message="message" />
            </template>

            <AIBubble
              v-else-if="['assistant', 'error'].includes(message.role) && message.content.trim()"
              :date="getFormattedDate(message.createdAt)"
              :isError="message.role === 'error'"
              @tryAgain="handleRetryAgent(message.id)"
            >
              <Error :text="message.content" />
            </AIBubble>
          </template>
        </template>
        <template v-else-if="!isTemporaryChat">
          <UserBubbleSkeleton />
          <AIBubbleSkeleton />
          <UserBubbleSkeleton />
          <AIBubbleSkeleton />
        </template>

        <div style="overflow-anchor: auto; height: 1px"></div>
      </div>
    </main>

    <footer class="p-4">
      <AIInput @send="send" :is-last-message-steps="isLastMessageSteps" />
    </footer>
  </aside>
</template>
