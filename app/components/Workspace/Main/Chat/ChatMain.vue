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

const emit = defineEmits<{
  setMessagesRef: [el: HTMLDivElement]
}>()

const GAP_OFFSET = 8

const chatContainerRef = ref<HTMLElement | null>(null)
const messagesInnerRef = ref<HTMLElement | null>(null)

const spacerHeight = ref(0)
const baseSpacerHeight = ref(0)
const consumedByScroll = ref(0)
const hasActiveTurn = ref(false)

const isAnimatingSend = ref(false)

let resizeObserver: ResizeObserver | null = null

function setContainerRef(el: any) {
  chatContainerRef.value = el
  emit('setMessagesRef', el)
}

function updateSpacer() {
  if (!chatContainerRef.value || !messagesInnerRef.value || !hasActiveTurn.value) return

  const container = chatContainerRef.value
  const elements = container.querySelectorAll<HTMLElement>('.chat-message')
  if (elements.length === 0) return

  let activeTurnHeight = 0
  let foundUserMessage = false
  let elementsInTurnCount = 0

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]!
    activeTurnHeight += el.offsetHeight
    elementsInTurnCount++

    if (el.classList.contains('chat-user-message')) {
      foundUserMessage = true
      break
    }
  }

  if (!foundUserMessage && elements.length >= 2) {
    activeTurnHeight = elements[0]!.offsetHeight + elements[1]!.offsetHeight
    elementsInTurnCount = 2
  }

  if (elementsInTurnCount > 1) {
    activeTurnHeight += (elementsInTurnCount - 1) * GAP_OFFSET
  }

  const styles = getComputedStyle(container)
  const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
  const containerHeight = container.clientHeight - verticalPadding

  baseSpacerHeight.value = Math.max(0, containerHeight - activeTurnHeight)
  const newHeight = Math.max(0, baseSpacerHeight.value - consumedByScroll.value)
  spacerHeight.value = newHeight

  if (newHeight === 0 && baseSpacerHeight.value > 0) {
    hasActiveTurn.value = false
  }
}

function handleWheel(e: WheelEvent) {
  if (!hasActiveTurn.value || spacerHeight.value <= 0) return

  if (e.deltaY < 0) {
    consumedByScroll.value += Math.abs(e.deltaY)
    const newHeight = Math.max(0, baseSpacerHeight.value - consumedByScroll.value)
    spacerHeight.value = newHeight

    if (newHeight === 0) {
      hasActiveTurn.value = false
    }
  }
}

let touchStartY = 0
function handleTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) touchStartY = e.touches[0]!.clientY
}
function handleTouchMove(e: TouchEvent) {
  if (!hasActiveTurn.value || spacerHeight.value <= 0 || e.touches.length === 0) return

  const deltaY = touchStartY - e.touches[0]!.clientY
  touchStartY = e.touches[0]!.clientY

  if (deltaY < 0) {
    consumedByScroll.value += Math.abs(deltaY)
    const newHeight = Math.max(0, baseSpacerHeight.value - consumedByScroll.value)
    spacerHeight.value = newHeight

    if (newHeight === 0) {
      hasActiveTurn.value = false
    }
  }
}

watch(
  () => props.isSending,
  (sending) => {
    if (sending) {
      hasActiveTurn.value = true
      consumedByScroll.value = 0
      isAnimatingSend.value = true

      nextTick(() => {
        if (chatContainerRef.value) {
          chatContainerRef.value.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }

        updateSpacer()

        setTimeout(() => {
          isAnimatingSend.value = false
        }, 500)
      })
    }
  },
)

watch([() => props.reversedMessages.length, () => props.areMessagesLoading], ([len, loading]) => {
  if (len === 0 || loading) {
    hasActiveTurn.value = false
    spacerHeight.value = 0
    baseSpacerHeight.value = 0
    consumedByScroll.value = 0
    isAnimatingSend.value = false
  }
})

onMounted(() => {
  resizeObserver = new ResizeObserver(() => updateSpacer())

  if (messagesInnerRef.value) {
    resizeObserver.observe(messagesInnerRef.value)
  }

  const container = chatContainerRef.value
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  const container = chatContainerRef.value
  if (container) {
    container.removeEventListener('wheel', handleWheel)
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
  }
})

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
      :ref="setContainerRef"
    >
      <div
        v-if="hasActiveTurn && spacerHeight > 0"
        :style="{ height: `${spacerHeight}px`, overflowAnchor: 'none' }"
        class="w-full shrink-0 pointer-events-none"
        aria-hidden="true"
      />

      <div
        :class="
          cn(
            'w-full flex flex-col-reverse items-start gap-2',
            isMainChat && 'max-w-4xl',
            isChatEmpty && 'h-full justify-center',
          )
        "
        ref="messagesInnerRef"
      >
        <template v-if="!areMessagesLoading">
          <div
            v-if="isSending"
            class="chat-message"
          >
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
                class="chat-message chat-user-message"
                :text="message.content"
                :date="getFormattedDate(message.createdAt)"
              />

              <ChatStatus
                v-else-if="message.role === 'status' && message.content"
                class="chat-message"
                :is-content-full-width="isContentFullWidth"
                :is-demo="isDemo"
                :status="message.content"
                :message="message"
                :chat-id="message.chatId"
                :thread-id="message.threadId"
              />

              <AIBubble
                v-else-if="message.role === 'assistant' && message.content.trim()"
                class="chat-message"
                :date="getFormattedDate(message.createdAt)"
                :is-content-full-width="isContentFullWidth"
              >
                <MarkdownContent :text="message.content" />

                <template #actions>
                  <AIResponseActions
                    :credits-spent="getStatusMessageByIteration(message.iterationId)?.creditsUsed"
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
