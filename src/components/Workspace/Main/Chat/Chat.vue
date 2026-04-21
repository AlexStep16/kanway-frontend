<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { useChatMessages } from '@/composables/chatMessages/queries/useChatMessages'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import { useSendMessage } from '@/composables/chat/mutations/useSendMessage'
import AIInput from './AIInput.vue'
import ChatSideHeader from './ChatSideHeader.vue'
import ChatMain from './ChatMain.vue'
import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue'
import ChatDefaultHeader from './ChatDefaultHeader.vue'
import { useUIStore } from '@/stores/ui'
import { useChat } from '@/composables/chat/queries/useChat'

const uiStore = useUIStore()
const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)
const { activeChatId } = storeToRefs(chatStore)

const { data: activeChat } = useChat(activeChatId, activeWorkspaceId)

const messagesRef = ref<HTMLDivElement | null>(null)
const aiInputRef = ref<InstanceType<typeof AIInput> | null>(null)
const abortController = ref<AbortController | null>(null)
const savedMessage = ref<string>('')

const { data: messages, isFetching: areMessagesLoading } = useChatMessages(activeChatId)
const { mutate: sendMessage, isPending: isMessageSending, isError, error } = useSendMessage()

const { mutate: stopAgent } = useStopAgent()

function stopActiveAgent() {
  if (activeChat.value && agentStatusStore.isSSEActive()) {
    stopAgent({
      chatId: activeChat.value.id,
      jobId: agentStatusStore.activeJobId!,
    })
  }
}

function handleStop() {
  if (isMessageSending.value) {
    abortController.value?.abort()
  } else if (activeChatId.value && agentStatusStore.activeJobId) {
    stopAgent({
      chatId: activeChatId.value,
      jobId: agentStatusStore.activeJobId,
    })
  }
}

function send(message: string) {
  if (!message.trim() || isMessageSending.value || !activeChatId.value) return

  savedMessage.value = message.trim()
  abortController.value = new AbortController()

  sendMessage(
    {
      payload: {
        message,
        modelType: chatStore.modelType,
        boardId: activeBoardId.value || '',
        threadId: activeChat.value?.threadId || '',
        workspaceId: activeWorkspaceId.value || '',
      },
      chatId: activeChatId.value,
      signal: abortController.value.signal,
    },
    {
      onError() {
        aiInputRef.value?.setMessage(savedMessage.value)
        savedMessage.value = ''
      },
      onSettled() {
        abortController.value = null
      },
    },
  )

  if (messagesRef.value) {
    nextTick(() =>
      messagesRef.value?.scrollTo({
        top: 0,
      }),
    )
  }
}

const reversedMessages = computed(() => {
  return [...(messages.value || [])].reverse()
})

function sendAgain() {
  const lastHumanMessage = reversedMessages.value.find((msg) => msg.role === 'user')

  if (lastHumanMessage) {
    send(lastHumanMessage.content)
  }
}

const isLastMessageSteps = computed(() => {
  const lastMessage = messages.value?.at(-1) || null

  if (lastMessage && lastMessage.role === 'steps') {
    return true
  } else return false
})

const isMainChat = computed(() => {
  return (
    (boardStore.activeBoardId === null && uiStore.isBoardTabSelected) || uiStore.isChatTabSelected
  )
})

const isInitialMessagesLoading = computed(() => {
  return areMessagesLoading.value && messages.value?.length === 0
})

onMounted(() => {
  window.addEventListener('beforeunload', stopActiveAgent)
})

onBeforeUnmount(() => {
  stopActiveAgent()
  window.removeEventListener('beforeunload', stopActiveAgent)
})
</script>

<template>
  <SidebarInset>
    <div class="min-w-130 flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <ChatDefaultHeader v-if="isMainChat" />
      <ChatSideHeader v-else />

      <ChatMain
        :isMainChat="isMainChat"
        :isSending="isMessageSending"
        :isError="isError"
        :error="error"
        :aiInputRef="aiInputRef"
        :reversedMessages="reversedMessages"
        :areMessagesLoading="isInitialMessagesLoading"
        @sendAgain="sendAgain"
        @setMessagesRef="(el: HTMLDivElement) => (messagesRef = el)"
      />

      <footer class="w-full flex justify-center p-4">
        <div class="w-full max-w-4xl">
          <AIInput
            @send="send"
            @stop="handleStop"
            ref="aiInputRef"
            :is-disabled="isMessageSending"
            :is-focused="true"
            :is-last-message-steps="isLastMessageSteps"
          />
        </div>
      </footer>
    </div>
  </SidebarInset>
</template>
