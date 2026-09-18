<script setup lang="ts">
import AIInput from './AIInput.vue'
import ChatSideHeader from './ChatSideHeader.vue'
import ChatMain from './ChatMain.vue'
import ChatDefaultHeader from './ChatDefaultHeader.vue'
import { useSidebar } from '~/components/ui/sidebar/utils.js'

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

const { data: messages, isFetching: areMessagesFetching } = useChatMessages(activeChatId)
const { mutate: sendMessage, isPending: isMessageSending } = useSendMessage()

const isBoardEmpty = computed(() => activeBoardId.value === null)
const shouldUseDrawer = computed(() => isMobile.value && !isBoardEmpty.value)
const isChatTabShown = computed(() => uiStore.isChatOpen)

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

const isInitialMessagesLoading = useDelayedLoading(
  computed(() => {
    return areMessagesFetching.value && messages.value?.length === 0
  }),
)

const observer = ref<ResizeObserver | null>(null)
const { state, isMobile } = useSidebar()

onMounted(() => {
  chatStore.restoreSession()

  window.addEventListener('beforeunload', stopActiveAgent)

  observer.value = new ResizeObserver(() => {
    if (aiInputRef.value) {
      aiInputRef.value.updateTextarea()
    }
  })

  if (chatContainerRef.value) {
    observer.value.observe(chatContainerRef.value)
  }
})

watch(chatContainerRef, (el) => {
  if (el && observer.value) {
    observer.value.observe(el)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', stopActiveAgent)
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <Drawer
    v-if="shouldUseDrawer"
    :open="uiStore.isChatOpen"
    @update:open="(val: boolean) => !val && uiStore.closeChat()"
  >
    <DrawerContent class="h-[90dvh] flex flex-col p-0 focus:outline-none">
      <DrawerHeader class="sr-only">
        <DrawerTitle>AI Чат</DrawerTitle>
      </DrawerHeader>

      <ChatDrawerHeader />

      <div
        class="flex-1 overflow-hidden flex flex-col"
        data-vaul-no-drag
      >
        <ChatMain
          :isMainChat="false"
          :isSending="isMessageSending"
          :aiInputRef="aiInputRef"
          :reversedMessages="reversedMessages"
          :areMessagesLoading="isInitialMessagesLoading"
          @sendAgain="sendAgain"
          @setMessagesRef="(el: HTMLDivElement) => (messagesRef = el)"
        />
      </div>

      <footer
        class="w-full flex justify-center p-4 sm:p-5 border-t border-zinc-200/70 bg-white/70 backdrop-blur-sm"
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
    </DrawerContent>
  </Drawer>

  <SidebarInset
    v-else
    v-show="isChatTabShown"
    class="relative z-20 flex flex-col bg-white overflow-hidden border-l border-zinc-200"
    :class="[
      uiStore.isChatFullscreen && 'flex-1',
      !uiStore.isChatFullscreen && 'w-130 lg:flex-[0_0_520px] shrink-0',
      state === 'collapsed' && activeBoardId && 'ml-0!',
    ]"
  >
    <div
      class="w-full flex flex-1 flex-col overflow-hidden bg-white"
      ref="chatContainerRef"
    >
      <ChatDefaultHeader v-if="uiStore.isChatFullscreen" />
      <ChatSideHeader v-else />

      <ChatMain
        :isMainChat="uiStore.isChatFullscreen"
        :isSending="isMessageSending"
        :aiInputRef="aiInputRef"
        :reversedMessages="reversedMessages"
        :areMessagesLoading="isInitialMessagesLoading"
        @sendAgain="sendAgain"
        @setMessagesRef="(el: HTMLDivElement) => (messagesRef = el)"
      />

      <footer
        class="w-full flex justify-center p-4 sm:p-5 border-t border-zinc-200/70 bg-white/70 backdrop-blur-sm"
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
