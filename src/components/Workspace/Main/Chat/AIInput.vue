<script setup lang="ts">
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { Mic, Square } from 'lucide-vue-next'
import Sparkles from '@assets/sparkles.svg?component'
import { computed, nextTick, onMounted, ref } from 'vue'
import { Nullable } from '@/types/utils'
import { HSTextareaAutoHeight } from 'preline'
import { storeToRefs } from 'pinia'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import { useChatMessageStore } from '@/stores/chatMessage'
import { useChat } from '@/composables/chat/queries/useChat'

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const message = ref<string>('')
const textareaRef = ref<Nullable<HTMLTextAreaElement>>(null)

const agentStatusStore = useAgentStatusStore()
const chatStore = useChatStore()
const chatMessageStore = useChatMessageStore()

const { activeChatId } = storeToRefs(chatStore)
const { data: chat } = useChat(activeChatId)
const { isLastMessageFromHuman } = storeToRefs(chatMessageStore)
const { mutate: stopAgent } = useStopAgent()

function sendChatMessage() {
  emit('send', message.value.trim())

  message.value = ''

  nextTick(() => {
    reInitializeTextarea()
  })
}

function reInitializeTextarea() {
  if (textareaRef.value && textareaRef.value instanceof HTMLTextAreaElement) {
    const { element } = HSTextareaAutoHeight.getInstance(textareaRef.value, true) as any

    element?.destroy()
    element?.init()
  }
}

function handleStopAgent() {
  if (chat.value) {
    stopAgent({
      chatId: chat.value.id,
      threadId: chat.value.threadId,
    })
  }
}

const isRunButtonDisabled = computed(() => {
  return (
    agentStatusStore.isSSEActive() ||
    (isLastMessageFromHuman.value === false && message.value.trim() === '')
  )
})

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  window.addEventListener('resize', reInitializeTextarea)
})
</script>

<template>
  <div class="w-full mt-1 relative p-1.5 rounded-md bg-white border border-gray-200">
    <div class="flex gap-x-1 items-end">
      <div class="w-full min-h-8 flex items-center">
        <textarea
          class="block p-0 w-full ps-1 text-gray-700 bg-transparent max-h-60 placeholder:text-gray-500 border-none focus:ring-0 text-sm disabled:opacity-50 disabled:pointer-events-none resize-none"
          placeholder="Например, создай задачу сделать отчёт..."
          data-hs-textarea-auto-height='{
            "defaultHeight": "auto"
          }'
          rows="1"
          v-model="message"
          @keydown.enter.stop
          ref="textareaRef"
        ></textarea>
      </div>
      <div class="flex shrink-0 items-center gap-x-2">
        <button
          type="button"
          class="flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-200 transition-colors duration-100 size-8 rounded-md"
          :disabled="agentStatusStore.isSSEActive()"
        >
          <Mic class="size-5" />
        </button>
        <button
          type="button"
          class="text-white bg-blue-500 px-3 text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity duration-100 rounded-md inline-flex items-center gap-x-2 h-8"
          :disabled="isRunButtonDisabled"
          v-if="!agentStatusStore.isSSEActive()"
          @click="sendChatMessage()"
        >
          <span class="hidden sm:inline">Выполнить</span>
          <Sparkles class="size-4" />
        </button>

        <button
          type="button"
          class="text-white bg-blue-500 px-3 text-xs min-w-20 font-medium hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity duration-100 rounded-md inline-flex items-center gap-x-2 h-8"
          v-else
          @click="handleStopAgent()"
        >
          <Square class="size-3.5" fill="#FFFFFF" />
          <span>{{ agentStatusStore.formattedTime }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
