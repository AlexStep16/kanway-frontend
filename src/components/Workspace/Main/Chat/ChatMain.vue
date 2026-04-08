<script setup lang="ts">
import UserBubble from '@components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import UserBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/UserBubbleSkeleton.vue'
import AIBubble from '@components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AIBubbleSkeleton from '@components/Workspace/Main/Chat/Bubbles/AIBubbleSkeleton.vue'
import Assistant from '@components/Workspace/Main/Chat/Bubbles/Assistant.vue'
import ChatDisplay from './ChatDisplay.vue'
import ChatThinking from './ChatThinking.vue'
import { CustomEventsEnum } from '@/enums/CustomEventsEnum'
import ChatLog from './ChatLog.vue'
import ChatAmbiguous from './ChatAmbiguous.vue'
import Error from './Bubbles/Error.vue'
import StartChatTitle from './StartChatTitle.vue'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat'
import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useChat } from '@/composables/chat/queries/useChat'
import { useRetryAgent } from '@/composables/chat/mutations/useRetryAgent'
import AIInput from './AIInput.vue'
import dayjs from 'dayjs'
import ChatMessageModel from '@/models/ChatMessageModel'
import { START_TILES } from '@/constants/START_TILES'

const props = defineProps<{
  isMainChat?: boolean
  isError?: boolean
  isSending?: boolean
  aiInputRef?: InstanceType<typeof AIInput> | null
  reversedMessages: ChatMessageModel[]
  areMessagesLoading: boolean
}>()

const chatStore = useChatStore()
const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { data: activeChat } = useChat(chatStore.activeChatId, activeWorkspaceId)

const { activeChatId } = storeToRefs(chatStore)

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
          <template v-if="isChatEmpty">
            <StartChatTitle :is-main-chat="isMainChat" @tile-click="handleTileClick" />
          </template>
          <template v-else>
            <AIBubble
              v-if="isError"
              :is-content-full-width="isContentFullWidth"
              :isError="true"
              @tryAgain="$emit('sendAgain')"
            >
              <Error />
            </AIBubble>

            <template v-for="message in reversedMessages" :key="message.id">
              <UserBubble
                v-if="message.role === 'user'"
                :text="message.content"
                :date="getFormattedDate(message.createdAt)"
              />

              <ChatThinking
                :is-content-full-width="isContentFullWidth"
                v-else-if="message.role === 'steps'"
                :steps="message.content"
                :is-sending="props.isSending"
              />

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
                :is-content-full-width="isContentFullWidth"
                :isError="message.role === 'error'"
                @tryAgain="handleRetryAgent(message.id)"
              >
                <Assistant :text="message.content" v-if="message.role === 'assistant'" />
                <Error :text="message.content" v-else />
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
