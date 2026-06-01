<script setup lang="ts">
import UserBubble from '~/components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import UserBubbleSkeleton from '~/components/Workspace/Main/Chat/Bubbles/UserBubbleSkeleton.vue'
import AIBubble from '~/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AIBubbleSkeleton from '~/components/Workspace/Main/Chat/Bubbles/AIBubbleSkeleton.vue'
import AssistantBubble from '~/components/Workspace/Main/Chat/Bubbles/AssistantBubble.vue'
import ChatStatus from './ChatStatus/ChatStatus.vue'
import ErrorBubble from './Bubbles/ErrorBubble.vue'
import StartChatTitle from './StartChatTitle.vue'
import { cn } from '~/lib/utils'
import AIInput from './AIInput.vue'
import dayjs from 'dayjs'
import ChatMessageModel from '~/models/ChatMessageModel'
import { START_TILES } from '~/constants/START_TILES'

const props = defineProps<{
  isMainChat?: boolean
  isError?: boolean
  error: Error | null
  isSending?: boolean
  aiInputRef?: InstanceType<typeof AIInput> | null
  reversedMessages: ChatMessageModel[]
  areMessagesLoading: boolean
}>()

const chatStore = useChatStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const activeBoardId = computed(() => boardStore.activeBoardId)
const activeWorkspaceId = computed(() => workspaceStore.activeWorkspaceId)
const activeChatId = computed(() => chatStore.activeChatId)

const { data: activeChat } = useChat(chatStore.activeChatId, activeWorkspaceId)

const { mutate: retryAgent } = useRetryAgent()

function handleRetryAgent(messageId: string) {
  retryAgent({
    payload: {
      chatId: activeChatId.value || '',
      threadId: activeChat.value?.threadId || '',
      chatMessageId: messageId,
      boardId: activeBoardId.value || '',
      workspaceId: activeWorkspaceId.value || '',
    },
    chatId: activeChatId.value ?? '',
  })
}

const getFormattedDate = (date: Date) => {
  return dayjs(date).calendar() + ' в ' + dayjs(date).format('HH:mm')
}

const isContentFullWidth = computed(() => {
  return props.isMainChat
})

const isChatEmpty = computed(() => {
  return props.reversedMessages.length === 0 && !props.areMessagesLoading
})

const isAbortedError = computed(() => {
  return props.error instanceof ClientAbortedError
})

function handleTileClick(tile: (typeof START_TILES)[number]) {
  props.aiInputRef?.setMessage(tile.query)
}
</script>

<template>
  <main
    class="w-full min-h-0 overflow-hidden grow"
    :class="{
      'h-full': isMainChat,
    }"
  >
    <div
      :class="
        cn(
          'flex flex-col-reverse items-center overflow-y-auto overflow-x-hidden min-h-0 max-h-full py-6 px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300',
          isMainChat && 'px-2',
          isChatEmpty && 'h-full',
        )
      "
      style="scrollbar-gutter: stable both-edges"
      :ref="(el: any) => $emit('setMessagesRef', el)"
    >
      <div
        :class="
          cn(
            'w-full flex flex-col-reverse items-start gap-2',
            isMainChat && 'max-w-4xl',
            isChatEmpty && 'h-full justify-center',
          )
        "
      >
        <template v-if="!areMessagesLoading">
          <div v-if="isSending">
            <div class="text-xs overflow-hidden relative">
              <span class="shimmer-text_muted">Устанавливаю связь...</span>
            </div>
          </div>

          <template v-if="isChatEmpty">
            <StartChatTitle
              :is-main-chat="isMainChat"
              @tile-click="handleTileClick"
            />
          </template>
          <template v-else>
            <AIBubble
              v-if="isError && !isAbortedError"
              :is-content-full-width="isContentFullWidth"
              :isError="true"
              :error="error"
              @tryAgain="$emit('sendAgain')"
            >
              <ErrorBubble />
            </AIBubble>

            <template
              v-for="message in reversedMessages"
              :key="message.id"
            >
              <UserBubble
                v-if="message.role === 'user'"
                :text="message.content"
                :date="getFormattedDate(message.createdAt)"
              />

              <AIBubble v-else-if="message.role === 'status' && message.content">
                <ChatStatus
                  :is-content-full-width="isContentFullWidth"
                  :status="message.content"
                  :credits-used="message.creditsUsed"
                  :chat-id="message.chatId"
                  :thread-id="message.threadId"
                />
              </AIBubble>

              <AIBubble
                v-else-if="['assistant', 'error'].includes(message.role) && message.content.trim()"
                :date="getFormattedDate(message.createdAt)"
                :is-content-full-width="isContentFullWidth"
                :isError="message.role === 'error'"
                @tryAgain="handleRetryAgent(message.id)"
              >
                <AssistantBubble
                  :text="message.content"
                  v-if="message.role === 'assistant'"
                />
                <ErrorBubble
                  :text="message.content"
                  v-else
                />
              </AIBubble>
            </template>
          </template>
        </template>
        <template v-else>
          <UserBubbleSkeleton />
          <AIBubbleSkeleton />
          <UserBubbleSkeleton />
          <AIBubbleSkeleton />
        </template>

        <div style="overflow-anchor: auto; height: 1px"></div>
      </div>
    </div>
  </main>
</template>
