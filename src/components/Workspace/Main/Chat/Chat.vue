<script setup lang="ts">
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import UserBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/UserBubbleSkeleton.vue'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AIBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/AIBubbleSkeleton.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import Stepper from '@components/Workspace/Main/Chat/Bubbles/Stepper.vue'
import { computed, onBeforeUnmount, onMounted } from 'vue'
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
import Spinner from '@/components/ui/spinner/Spinner.vue'

const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { activeChat } = storeToRefs(chatStore)

const activeChatId = computed(() => activeChat.value?.id || null)
const activeChatWorkspaceId = computed(() => activeChat.value?.workspaceId || null)

const chat = useChat(activeChatId, activeChatWorkspaceId)

const { data: messages, isPending: areMessagesLoading } = useChatMessages(activeChatId)

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
</script>

<template>
  <!-- Body -->
  <div
    class="flex flex-col grow gap-2 min-h-0 overflow-y-auto py-2 px-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
  >
    <template v-if="!areMessagesLoading">
      <template v-for="message in messages" :key="message.id">
        <UserBubble
          v-if="message.role === 'user'"
          :text="message.content"
          :date="getFormattedDate(message.createdAt)"
        />
        <AIBubble
          v-else-if="['assistant', 'error'].includes(message.role)"
          :date="getFormattedDate(message.createdAt)"
          :isError="message.role === 'error'"
          @tryAgain="handleRetryAgent(message.id)"
        >
          <Assistant :text="message.content" />
        </AIBubble>
        <AIBubble v-else-if="message.role === 'steps'">
          <Stepper :steps="message.content" />
        </AIBubble>

        <template v-else-if="message.role === CustomEventsEnum.OPERATION">
          <ChatLog :message="message" />
        </template>

        <template v-else-if="message.role === CustomEventsEnum.AMBIGUOUS">
          <ChatAmbiguous :message="message" />
        </template>
      </template>
    </template>
    <template v-else>
      <UserBubbleSkeleton />
      <AIBubbleSkeleton />
      <UserBubbleSkeleton />
      <AIBubbleSkeleton />
    </template>

    <AIBubble v-if="agentStatusStore.isThinking">
      <Spinner class="size-4" />
    </AIBubble>
  </div>
</template>
