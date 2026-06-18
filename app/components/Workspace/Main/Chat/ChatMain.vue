<script setup lang="ts">
import UserBubble from '~/components/Workspace/Main/Chat/Bubbles/UserBubble.vue'
import UserBubbleSkeleton from '~/components/Workspace/Main/Chat/Bubbles/UserBubbleSkeleton.vue'
import AIBubble from '~/components/Workspace/Main/Chat/Bubbles/AIBubble.vue'
import AIBubbleSkeleton from '~/components/Workspace/Main/Chat/Bubbles/AIBubbleSkeleton.vue'
import AIResponseActions from '~/components/Workspace/Main/Chat/Bubbles/AIResponseActions.vue'
import MarkdownContent from '~/components/Workspace/Main/Chat/Bubbles/MarkdownContent.vue'
import ChatStatus from './ChatStatus/ChatStatus.vue'
import StartChatTitle from './StartChatTitle.vue'
import { cn } from '~/lib/utils'
import AIInput from './AIInput.vue'
import dayjs from 'dayjs'
import ChatMessageModel from '~/models/ChatMessageModel'
import { START_TILES } from '~/constants/START_TILES'

const props = defineProps<{
  isMainChat?: boolean
  isSending?: boolean
  isDemo?: boolean
  aiInputRef?: InstanceType<typeof AIInput> | null
  reversedMessages: ChatMessageModel[]
  areMessagesLoading: boolean
}>()

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

function getStatusMessageByIteration(iterationId: string) {
  return props.reversedMessages.find(
    (message) => message.role === 'status' && message.iterationId === iterationId,
  )
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
          'flex flex-col-reverse items-center overflow-y-auto overflow-x-hidden min-h-0 max-h-full p-4 custom-scrollbar',
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
            <template
              v-for="message in reversedMessages"
              :key="message.id"
            >
              <UserBubble
                v-if="message.role === 'user'"
                :text="message.content"
                :date="getFormattedDate(message.createdAt)"
              />

              <ChatStatus
                v-else-if="message.role === 'status' && message.content"
                :is-content-full-width="isContentFullWidth"
                :is-demo="isDemo"
                :status="message.content"
                :message="message"
                :chat-id="message.chatId"
                :thread-id="message.threadId"
              />

              <AIBubble
                v-else-if="message.role === 'assistant' && message.content.trim()"
                :date="getFormattedDate(message.createdAt)"
                :is-content-full-width="isContentFullWidth"
              >
                <MarkdownContent :text="message.content" />

                <template #actions>
                  <AIResponseActions
                    :credits-spent="getStatusMessageByIteration(message.iterationId)?.creditsUsed"
                    :audio-credits-spent="
                      getStatusMessageByIteration(message.iterationId)?.audioCreditsUsed
                    "
                    :message="message"
                    :is-demo="isDemo"
                  />
                </template>
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
