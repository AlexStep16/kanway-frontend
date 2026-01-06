<script setup lang="ts">
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { Mic, Square } from 'lucide-vue-next'
import Sparkles from '@assets/sparkles.svg?component'
import { computed, ref } from 'vue'

const message = ref<string>('')

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const AGENT_STATUS_STORE = useAgentStatusStore()
const CHAT_STORE = useChatStore()

function sendChatMessage() {
  emit('send', message.value.trim())

  message.value = ''
}

const isRunButtonDisabled = computed(() => {
  return message.value.trim().length === 0 || AGENT_STATUS_STORE.isSSEActive()
})
</script>

<template>
  <div class="w-full mt-1 relative p-1.5 rounded-md bg-white border border-gray-200">
    <div class="flex gap-x-1 items-end">
      <div class="w-full min-h-8 flex items-center">
        <textarea
          id="chat-textarea"
          class="block p-0 w-full ps-1 text-gray-700 bg-transparent max-h-60 placeholder:text-gray-500 border-none focus:ring-0 text-sm disabled:opacity-50 disabled:pointer-events-none resize-none"
          placeholder="Например, создай задачу сделать отчёт..."
          data-hs-textarea-auto-height='{
            "defaultHeight": "auto"
          }'
          rows="1"
          v-model="message"
        ></textarea>
      </div>
      <div class="flex shrink-0 items-center gap-x-2">
        <button
          type="button"
          class="flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-200 transition-colors duration-100 size-8 rounded-md"
          :disabled="AGENT_STATUS_STORE.isSSEActive()"
        >
          <Mic class="size-5" />
        </button>
        <button
          type="button"
          class="text-white bg-blue-500 px-3 text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity duration-100 rounded-md inline-flex items-center gap-x-2 h-8"
          :disabled="isRunButtonDisabled"
          v-if="!AGENT_STATUS_STORE.isSSEActive()"
          @click="sendChatMessage()"
        >
          <span class="hidden sm:inline">Выполнить</span>
          <Sparkles class="size-4" />
        </button>

        <button
          type="button"
          class="text-white bg-blue-500 px-3 text-xs min-w-20 font-medium hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity duration-100 rounded-md inline-flex items-center gap-x-2 h-8"
          v-else
          @click="CHAT_STORE.stopAgent()"
        >
          <Square class="size-3.5" fill="#FFFFFF" />
          <span>{{ AGENT_STATUS_STORE.formattedTime }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
