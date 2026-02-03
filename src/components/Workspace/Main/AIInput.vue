<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { HSTextareaAutoHeight } from 'preline'

import { useBoardStore } from '@/stores/board'
import { useWorkspaceStore } from '@/stores/workspace'
import { useSendMessage } from '@/composables/chat/mutations/useSendMessage'

import Spinner from '@components/Loader/Spinner.vue'
import Sparkles from '@assets/sparkles.svg?component'
import { useChatStore } from '@/stores/chat'
import MicButton from '@components/Workspace/Main/MicButton.vue'
import { useAuthStore } from '@/stores/auth'
import EmailConfirmLabel from './EmailConfirmLabel.vue'

defineProps<{
  theme?: 'light' | 'dark'
  placeholder?: string
  noInputMargin?: boolean
}>()

const boardStore = useBoardStore()
const workspaceStore = useWorkspaceStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const { activeBoardId } = storeToRefs(boardStore)
const { activeWorkspaceId } = storeToRefs(workspaceStore)

const aiInput = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isConfirmShown = ref(true)

const { mutate: sendMessage, isPending: isMessageSending } = useSendMessage()

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

        nextTick(() => reInitializeTextarea())
      },
    },
  )
}

function reInitializeTextarea() {
  if (textareaRef.value) {
    const instance = HSTextareaAutoHeight.getInstance(textareaRef.value, true) as any
    if (instance?.element) {
      instance.element.destroy()
      instance.element.init()
    }
  }
}

onMounted(() => {
  if (window.HSStaticMethods) window.HSStaticMethods.autoInit()
  window.addEventListener('resize', reInitializeTextarea)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', reInitializeTextarea)
})
</script>

<template>
  <div
    class="flex flex-col"
    :class="{
      'mb-3 mt-1.5': !noInputMargin,
    }"
  >
    <EmailConfirmLabel
      v-if="user && !user.isConfirmed && isConfirmShown"
      :user="user"
      :isConfirmShown="isConfirmShown"
      @close="isConfirmShown = false"
    />
    <div
      class="w-full relative p-2 rounded-md bg-white"
      :class="{
        'bg-gray-100!': theme === 'dark',
        'border border-gray-200': theme === 'light' || !theme,
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
          <MicButton
            :isWorkspace="true"
            @deltaAdd="
              (deltaText: string) => {
                aiInput += deltaText
              }
            "
            @transcriptionCompleted="
              (finalText: string) => {
                aiInput = finalText
                handleSendMessage()
              }
            "
            @clearInput="
              () => {
                aiInput = ''
              }
            "
          ></MicButton>

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
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
