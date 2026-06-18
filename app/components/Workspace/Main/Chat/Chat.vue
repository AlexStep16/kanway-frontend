<script setup lang="ts">
import AIInput from './AIInput.vue'
import ChatSideHeader from './ChatSideHeader.vue'
import ChatMain from './ChatMain.vue'
import ChatDefaultHeader from './ChatDefaultHeader.vue'
import { useSidebar } from '~/components/ui/sidebar/utils.js'
import { cn } from '~/lib/utils.js'

const uiStore = useUIStore()
const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)
const activeChatId = computed(() => chatStore.activeChatId)

const { data: activeChat } = useChat(activeChatId, activeWorkspaceId)

const messagesRef = ref<HTMLDivElement | null>(null)
const chatContainerRef = ref<HTMLDivElement | null>(null)
const aiInputRef = ref<InstanceType<typeof AIInput> | null>(null)
const abortController = ref<AbortController | null>(null)
const savedMessage = ref<string>('')

const { data: messages, isFetching: areMessagesLoading } = useChatMessages(activeChatId)
const { mutate: sendMessage, isPending: isMessageSending } = useSendMessage()

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
  } else {
    stopActiveAgent()
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

const isMainChat = computed(() => {
  return (
    (boardStore.activeBoardId === null && uiStore.isBoardTabSelected) || uiStore.isChatTabSelected
  )
})

const isInitialMessagesLoading = computed(() => {
  return areMessagesLoading.value && messages.value?.length === 0
})

const isMobile = useMediaQuery('(max-width: 768px)')
const observer = ref<ResizeObserver | null>(null)
const { state } = useSidebar()

onMounted(() => {
  window.addEventListener('beforeunload', stopActiveAgent)

  observer.value = new ResizeObserver(() => {
    if (aiInputRef.value) {
      aiInputRef.value.updateTextarea()
    }
  })
  observer.value.observe(chatContainerRef.value!)
})

onBeforeUnmount(() => {
  stopActiveAgent()

  window.removeEventListener('beforeunload', stopActiveAgent)
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <SidebarInset
    class="z-20"
    :class="
      cn(
        isMobile && 'absolute max-w-screen w-full',
        state === 'collapsed' && !isMobile && activeBoardId && 'ml-0!',
      )
    "
  >
    <div
      class="w-full flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white"
      ref="chatContainerRef"
    >
      <ChatDefaultHeader v-if="isMainChat && !isMobile" />
      <ChatSideHeader v-else />

      <ChatMain
        :isMainChat="isMainChat"
        :isSending="isMessageSending"
        :aiInputRef="aiInputRef"
        :reversedMessages="reversedMessages"
        :areMessagesLoading="isInitialMessagesLoading"
        @sendAgain="sendAgain"
        @setMessagesRef="(el: HTMLDivElement) => (messagesRef = el)"
      />

      <footer
        class="w-full flex justify-center p-4 sm:p-5 border-t border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70"
      >
        <div class="w-full max-w-4xl">
          <AIInput
            @send="send"
            @stop="handleStop"
            ref="aiInputRef"
            :is-disabled="isMessageSending"
            :is-focused="true"
          />
        </div>
      </footer>
    </div>
  </SidebarInset>
</template>
