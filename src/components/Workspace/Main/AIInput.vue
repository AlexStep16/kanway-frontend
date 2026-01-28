<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { Mic } from 'lucide-vue-next'
import { HSTextareaAutoHeight } from 'preline'

import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { useSendMessage } from '@/composables/chat/mutations/useSendMessage'

import Spinner from '@components/Loader/Spinner.vue'
import Sparkles from '@assets/sparkles.svg?component'
import { useChatStore } from '@/stores/chat'

defineProps<{
  theme?: 'light' | 'dark'
  placeholder?: string
  noInputMargin?: boolean
}>()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()
const chatStore = useChatStore()
const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const aiInput = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isRecording = ref(false) // Для управления состоянием микрофона

const { mutate: sendMessage, isPending: isMessageSending } = useSendMessage()

// --- Logic ---

const handleSendMessage = () => {
  if (!aiInput.value.trim() || isMessageSending.value) return

  sendMessage(
    {
      payload: {
        message: aiInput.value,
        boardId: activeBoardId.value,
        workspaceId: activeWorkspaceId.value,
      },
      chatId: chatStore.activeChat?.id ?? '',
    },
    {
      onSuccess: () => {
        aiInput.value = ''
        // После очистки текста сбрасываем высоту
        nextTick(() => reInitializeTextarea())
      },
    },
  )
}

// Переинициализация высоты (Preline)
function reInitializeTextarea() {
  if (textareaRef.value) {
    const instance = HSTextareaAutoHeight.getInstance(textareaRef.value, true) as any
    if (instance?.element) {
      instance.element.destroy()
      instance.element.init()
    }
  }
}

// --- Lifecycle ---

onMounted(() => {
  // Инициализация Preline
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()
  window.addEventListener('resize', reInitializeTextarea)
})

onUnmounted(() => {
  window.removeEventListener('resize', reInitializeTextarea)
})
</script>

<template>
  <div
    class="w-full relative p-2 rounded-md bg-white"
    :class="{
      'bg-gray-100!': theme === 'dark',
      'border border-gray-200': theme === 'light' || !theme,
      ' mb-3 mt-1.5': !noInputMargin,
    }"
  >
    <div class="flex gap-x-1 items-end">
      <div class="w-full min-h-8 flex items-center">
        <textarea
          ref="textareaRef"
          class="block p-0 w-full ps-1 max-h-60 text-gray-700 bg-transparent placeholder:text-gray-500 border-none focus:ring-0 text-sm disabled:opacity-50 disabled:pointer-events-none resize-none"
          :placeholder="placeholder ? placeholder : 'Напишите что вы хотите сделать...'"
          data-hs-textarea-auto-height='{
            "defaultHeight": "auto"
          }'
          rows="1"
          v-model="aiInput"
        ></textarea>
      </div>

      <!-- Actions Area -->
      <div class="flex shrink-0 items-center gap-x-2">
        <!-- Voice Input (Simple) -->
        <button
          v-if="!isRecording"
          type="button"
          @click="isRecording = true"
          class="flex items-center justify-center size-8 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          title="Голосовой ввод"
        >
          <Mic class="size-4.5" />
        </button>

        <!-- Voice Input (Active with CSS Animation) -->
        <button
          v-else
          type="button"
          @click="isRecording = false"
          class="flex items-center justify-center size-8 rounded-md relative text-white"
        >
          <span class="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40"></span>
          <span class="absolute inset-0 rounded-full bg-red-500 z-1"></span>
          <Mic class="size-4.5 z-2" />
        </button>

        <button
          class="text-white bg-blue-500 px-3 text-xs font-medium hover:opacity-90 transition-opacity duration-100 rounded-md relative h-8"
          @click="handleSendMessage"
        >
          <div class="inline-flex items-center gap-x-2">
            Начать чат

            <Sparkles class="size-4" v-if="!isMessageSending" />
            <Spinner class="size-4" v-else />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

textarea::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
