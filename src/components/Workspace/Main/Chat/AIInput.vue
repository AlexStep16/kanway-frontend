<script setup lang="ts">
import { Mic, SendHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'

const message = ref<string>('')

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

function sendChatMessage() {
  if (message.value.trim() !== '') {
    emit('send', message.value.trim())
    message.value = ''
  }
}
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
          class="flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100 size-8 rounded-md"
        >
          <Mic class="size-5" />
        </button>
        <button
          class="text-white bg-blue-500 px-3 text-xs font-medium hover:opacity-90 transition-opacity duration-100 rounded-md inline-flex items-center gap-x-2 h-8"
          @click="sendChatMessage()"
        >
          <span class="hidden sm:inline">Отправить</span>
          <SendHorizontal class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
