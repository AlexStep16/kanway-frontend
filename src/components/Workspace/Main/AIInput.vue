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

defineProps<{
  theme?: 'light' | 'dark'
  placeholder?: string
  noInputMargin?: boolean
}>()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()
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

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
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
    class="w-full relative p-2 rounded-lg transition-all duration-200"
    :class="[
      theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200',
      !noInputMargin ? 'mb-3 mt-1.5' : '',
      isMessageSending ? 'opacity-70 pointer-events-none' : '',
    ]"
  >
    <div class="flex gap-x-2 items-end">
      <!-- Textarea Area -->
      <div class="w-full min-h-9 flex items-center">
        <textarea
          ref="textareaRef"
          v-model="aiInput"
          class="block p-0 w-full ps-1 max-h-60 text-sm bg-transparent border-none focus:ring-0 resize-none overflow-y-auto"
          :class="
            theme === 'dark'
              ? 'text-white placeholder:text-gray-400'
              : 'text-gray-700 placeholder:text-gray-500'
          "
          :placeholder="placeholder || 'Напишите, что вы хотите сделать...'"
          rows="1"
          data-hs-textarea-auto-height='{"defaultHeight": "auto"}'
          @keydown="handleKeyDown"
        ></textarea>
      </div>

      <!-- Actions Area -->
      <div class="flex shrink-0 items-center gap-x-1.5">
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

        <!-- Submit Button -->
        <button
          class="relative h-8 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-x-2 disabled:bg-gray-300"
          :disabled="!aiInput.trim() || isMessageSending"
          @click="handleSendMessage"
        >
          <span v-if="!isMessageSending" class="flex items-center gap-x-2">
            Отправить
            <Sparkles class="size-3.5" />
          </span>
          <span v-else class="flex items-center gap-x-2">
            Думаю...
            <Spinner class="size-3.5" />
          </span>
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
