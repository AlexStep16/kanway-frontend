<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import Recording from '~/components/Workspace/Main/Recording/Recording.vue'
import { AI_INPUT_PLACEHOLDERS } from '~/constants/AI_INPUT_PLACEHOLDERS'

const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()
const { data: user } = useUser()

const { aiInputMessage } = storeToRefs(chatStore)

const aiInputMessageRef = ref<HTMLTextAreaElement | null>(null)
const micButtonRef = ref<InstanceType<typeof Recording> | null>(null)
const isTextareaInitialized = ref(false)

const currentPlaceholderIndex = ref(0)
let placeholderIntervalId: any = null

// --- НАСТРОЙКИ ДЛЯ МОКА (для записи видео) ---
const ENABLE_MOCK = true // Поставьте false, когда запишете видео
const MOCK_TEXT =
  'Собери доску для запуска Telegram-бота с платной подпиской. Сделай этапы от MVP до масштабирования, раскидай задачи по разработке и платежкам. Критичные задачи выдели высоким приоритетом.'
const isMockRunning = ref(false)
// ----------------------------------------------

const props = defineProps<{
  isDisabled?: boolean
  isFocused?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', aiInputMessage: string): void
  (e: 'stop'): void
}>()

const isMobile = useMediaQuery('(max-width: 768px)')
const update = ref(() => {})

async function sendChatMessage(message: string) {
  message = message.trim()

  if (!message) return

  emit('send', message)

  aiInputMessage.value = ''
  if (aiInputMessageRef.value) aiInputMessageRef.value.blur()
}

// Функция имитации печати
async function handleMockClick() {
  if (
    !ENABLE_MOCK ||
    isMockRunning.value ||
    aiInputMessage.value.trim().length > 0 ||
    user.value?.email !== 'alexander.work2020@gmail.com'
  ) {
    return
  }

  isMockRunning.value = true
  aiInputMessage.value = ''

  // Печатаем посимвольно
  for (let i = 0; i < MOCK_TEXT.length; i++) {
    aiInputMessage.value += MOCK_TEXT[i]
    updateTextarea()
    // Быстрая реалистичная задержка между символами (20-35 мс)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 15 + 20))
  }
}

function handleTextareaRef(
  el: {
    textareaRef: HTMLTextAreaElement | null
    update: () => void
  } | null,
) {
  if (el && el.textareaRef && !isTextareaInitialized.value) {
    aiInputMessageRef.value = el.textareaRef
    update.value = el.update
    if (props.isFocused) aiInputMessageRef.value.focus()
    isTextareaInitialized.value = true
  }
}

function setMessage(newMessage: string) {
  aiInputMessage.value = newMessage
}

function updateTextarea() {
  if (update.value) {
    update.value()
  }
}

const isRunButtonDisabled = computed(() => {
  return (
    props.isDisabled ||
    (!aiInputMessage.value.trim() && !micButtonRef.value?.hasRecording) ||
    agentStatusStore.isSSEActive() ||
    !!micButtonRef.value?.isRecording ||
    !!micButtonRef.value?.isTranscribing
  )
})

const handleInput = (e: Event) => {
  aiInputMessage.value = (e.target as HTMLTextAreaElement).value
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.isComposing) return

  if (e.key === 'Enter' && !e.shiftKey && !isMobile.value) {
    e.preventDefault()

    if (isRunButtonDisabled.value) {
      return
    }

    sendChatMessage(aiInputMessage.value)
  }
}

onMounted(() => {
  placeholderIntervalId = setInterval(() => {
    currentPlaceholderIndex.value =
      (currentPlaceholderIndex.value + 1) % AI_INPUT_PLACEHOLDERS.length
  }, 4000)
})

onUnmounted(() => {
  clearInterval(placeholderIntervalId)
})

defineExpose({
  setMessage,
  updateTextarea,
})
</script>

<template>
  <div
    class="w-full relative p-2.5 rounded-xl bg-white/95 border border-zinc-200/80 shadow-sm ring-1 ring-black/2"
  >
    <div class="flex flex-col gap-2 items-end">
      <div class="w-full flex items-center relative">
        <Textarea
          class="p-0 border-none shadow-none min-h-12 rounded-none"
          :ref="(el) => handleTextareaRef(el as any)"
          v-model="aiInputMessage"
          @click="handleMockClick"
          @input="handleInput"
          @keydown="handleKeyDown"
        />

        <Transition
          name="placeholder-fade"
          mode="out-in"
        >
          <span
            v-if="!aiInputMessage.trim()"
            :key="currentPlaceholderIndex"
            class="absolute inset-0 pointer-events-none text-zinc-400 text-sm select-none"
          >
            {{ AI_INPUT_PLACEHOLDERS[currentPlaceholderIndex] }}
          </span>
        </Transition>
      </div>

      <div class="flex justify-between items-center flex-wrap gap-2 w-full">
        <AIModelSelect v-model="chatStore.modelType" />

        <div class="flex shrink-0 items-center gap-x-2">
          <Recording
            ref="micButtonRef"
            @sendMessage="sendChatMessage"
          ></Recording>
          <Button
            size="sm"
            :disabled="isRunButtonDisabled"
            v-if="!agentStatusStore.isSSEActive()"
            @click="sendChatMessage(aiInputMessage)"
          >
            <span class="text-xs">Отправить</span>
            <Sparkles class="size-4" />
          </Button>

          <Button
            size="sm"
            class="text-xs font-medium"
            v-else-if="!agentStatusStore.isStopped"
            @click="$emit('stop')"
          >
            <span>Остановить</span>
            <Spinner class="size-4" />
          </Button>

          <Button
            size="sm"
            class="text-xs min-w-30 font-medium"
            v-else
          >
            <Spinner class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
