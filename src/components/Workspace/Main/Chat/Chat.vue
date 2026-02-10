<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { X, MessagesSquare } from 'lucide-vue-next'
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import UserBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/UserBubbleSkeleton.vue'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AIBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/AIBubbleSkeleton.vue'
import AIInput from '@components/Workspace/Main/Chat/AIInput.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import Status from '@components/Workspace/Main/Chat/Bubbles/Status.vue'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import dayjs from 'dayjs'
import { useSendMessage } from '@/composables/chat/mutations/useSendMessage'
import { storeToRefs } from 'pinia'
import { useChat } from '@/composables/chat/queries/useChat'
import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { useRetryAgent } from '@/composables/chat/mutations/useRetryAgent'
import { useChatMessages } from '@/composables/chatMessages/queries/useChatMessages'
import { AgentRolesEnum } from '@/enums/AgentRolesEnum'
import ChatActions from './ChatActions.vue'
import ChatPreview from './ChatPreview.vue'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'

const uiStore = useUIStore()
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

const isLastMessageFromHuman = computed(() => {
  const lastMessage = messages.value?.at(-1) || null

  if (lastMessage && lastMessage.role === 'user') {
    return true
  } else return false
})

const { mutate: retryAgent } = useRetryAgent()
const { mutate: stopAgent } = useStopAgent()
const { mutate: sendMessage, isPending: isMessageSending } = useSendMessage()

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

const getFormattedDate = (date: Date) => {
  return dayjs(date).calendar() + ' в ' + dayjs(date).format('HH:mm')
}

function stopActiveAgent() {
  if (chat.value) {
    stopAgent({
      chatId: chat.value.id,
      threadId: chat.value.threadId,
    })
  }
}

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()
  window.addEventListener('beforeunload', stopActiveAgent)
})

onBeforeUnmount(() => {
  stopActiveAgent()
  window.removeEventListener('beforeunload', stopActiveAgent)
})
</script>

<template>
  <div
    id="hs-chat"
    :ref="
      (el) => {
        if (el) uiStore.chatModalRef = el as HTMLElement
      }
    "
    class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-80 opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    role="dialog"
    tabindex="-1"
  >
    <div class="size-full flex items-center justify-center p-2 sm:p-4">
      <div
        class="flex flex-col size-full max-w-4xl max-h-160 bg-white rounded-md pointer-events-auto px-4 py-3 overflow-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center gap-x-2 pb-2 border-b border-gray-200">
          <div class="flex items-center justify-center gap-x-2">
            <MessagesSquare class="size-4" />
            <h5 id="hs-task-edit-label" class="text-sm font-medium text-gray-800">
              {{ chat?.name }}
            </h5>
          </div>
          <button
            class="transition-colors duration-100 text-gray-400 hover:bg-gray-200 p-1 rounded-full"
            type="button"
            @click="uiStore.closeChatModal()"
          >
            <X class="size-5" />
          </button>
        </div>

        <!-- Body -->
        <div
          class="flex flex-col grow-1 gap-2 min-h-0 overflow-y-auto py-2 px-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
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

              <template v-else-if="message.role === AgentRolesEnum.ACTIONS">
                <ChatActions :message="message" />
              </template>

              <template v-else-if="message.role === AgentRolesEnum.PREVIEW">
                <ChatPreview :message="message" />
              </template>
            </template>
          </template>
          <template v-else>
            <UserBubbleSkeleton />
            <AIBubbleSkeleton />
            <UserBubbleSkeleton />
            <AIBubbleSkeleton />
          </template>

          <AIBubble
            :hideBackground="true"
            v-if="agentStatusStore.currentActivity && !agentStatusStore.assistantStream"
          >
            <Status :currentToolStatus="agentStatusStore.currentActivity" />
          </AIBubble>

          <AIBubble
            :date="dayjs().calendar()"
            :fastQuestions="[]"
            v-else-if="agentStatusStore.assistantStream"
          >
            <Assistant :text="agentStatusStore.assistantStream" />
          </AIBubble>
        </div>

        <!-- Footer -->
        <AIInput
          @send="send"
          :is-last-message-from-human="isLastMessageFromHuman"
          :no-input-margin="true"
        />
      </div>
    </div>
  </div>
</template>
