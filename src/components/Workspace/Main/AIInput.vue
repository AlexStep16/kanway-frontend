<script setup lang="ts">
import { Mic } from 'lucide-vue-next'
import { HSTextareaAutoHeight } from 'preline'
import { computed, nextTick, onMounted, ref } from 'vue'
import { Nullable } from '@/types/utils'
import { useBoardDataStore } from '@stores/boardData'
import { useWorkspaceDataStore } from '@stores/workspaceData'
import { useChatStore } from '@stores/chat'
import Spinner from '@components/Loader/Spinner.vue'
import Sparkles from '@assets/sparkles.svg?component'

defineProps<{
  theme?: 'light' | 'dark'
  placeholder?: string
  noInputMargin?: boolean
}>()

const waveScale = ref(1)
const textareaRef = ref<Nullable<HTMLTextAreaElement>>(null)
const aiInput = ref('')
const BOARD_STORE = useBoardDataStore()
const WORKSPACE_STORE = useWorkspaceDataStore()
const CHAT_STORE = useChatStore()

async function startChat() {
  if (!WORKSPACE_STORE.activeWorkspace || !BOARD_STORE.activeBoard) return

  const startResult = await CHAT_STORE.startChat(WORKSPACE_STORE.activeWorkspace.id, aiInput.value)

  if (startResult !== false) {
    aiInput.value = ''

    nextTick(() => {
      reInitializeTextarea()
    })
  }
}

function reInitializeTextarea() {
  if (textareaRef.value && textareaRef.value instanceof HTMLTextAreaElement) {
    const { element } = HSTextareaAutoHeight.getInstance(textareaRef.value, true) as any

    element?.destroy()
    element?.init()
  }
}

setInterval(() => {
  waveScale.value = 1 + Math.random() * 0.5
}, 200)

const isChatStarting = computed(() => CHAT_STORE.isChatStarting)

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()

  window.addEventListener('resize', reInitializeTextarea)
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
      <div class="flex shrink-0 items-center gap-x-2">
        <button
          type="button"
          class="flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors duration-100 size-8 rounded-md"
        >
          <Mic class="size-5" />
        </button>
        <button
          type="button"
          class="flex items-center justify-center text-white size-8 rounded-md relative"
        >
          <div
            class="size-8 z-1 rounded-full absolute bg-red-500 transition-all duration-200 opacity-40"
            :style="{ transform: `scale(${waveScale})` }"
          ></div>

          <div class="size-8 z-2 rounded-full absolute bg-red-400"></div>

          <Mic class="size-5 z-3" />
        </button>
        <button
          class="text-white bg-blue-500 px-3 text-xs font-medium hover:opacity-90 transition-opacity duration-100 rounded-md relative h-8"
          @click="startChat"
        >
          <div class="inline-flex items-center gap-x-2">
            Начать чат

            <Sparkles class="size-4" v-if="!isChatStarting" />
            <Spinner class="size-4" v-else />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
