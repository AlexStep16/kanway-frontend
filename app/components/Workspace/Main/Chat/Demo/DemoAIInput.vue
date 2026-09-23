<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import { Mic } from '@lucide/vue'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { AI_INPUT_PLACEHOLDERS } from '~/constants/AI_INPUT_PLACEHOLDERS'

defineProps<{
  isRunning: boolean
}>()

const aiInputMessage = defineModel<string>('aiInputMessage', { default: '' })
const modelType = ref<ModelsEnum>(ModelsEnum.GPT_5_4_MINI)
const aiInputMessageRef = ref<HTMLTextAreaElement | null>(null)

const currentPlaceholderIndex = ref(0)
let placeholderIntervalId: any = null

const update = ref(() => {})

function handleTextareaRef(
  el: {
    textareaRef: HTMLTextAreaElement | null
    update: () => void
  } | null,
) {
  if (el && el.textareaRef) {
    aiInputMessageRef.value = el.textareaRef
    update.value = el.update
  }
}

function updateTextarea() {
  if (update.value) {
    update.value()
  }
}

const handleInput = (e: Event) => {
  aiInputMessage.value = (e.target as HTMLTextAreaElement).value
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
  updateTextarea,
})
</script>

<template>
  <div
    class="w-full relative p-2.5 rounded-xl bg-white/95 border border-zinc-200/80 shadow-sm ring-1 ring-black/2"
  >
    <div class="flex flex-col gap-2 items-end">
      <div class="w-full flex items-center relative group">
        <Textarea
          class="p-0 border-none shadow-none min-h-12 rounded-none placeholder:text-zinc-400"
          v-model="aiInputMessage"
          :ref="(el) => handleTextareaRef(el as any)"
          @input="handleInput"
        />

        <Transition
          name="placeholder-fade"
          mode="out-in"
        >
          <span
            v-if="!aiInputMessage.trim()"
            :key="currentPlaceholderIndex"
            class="absolute inset-0 pointer-events-none text-zinc-400 text-sm select-none group-focus-within:invisible"
          >
            {{ AI_INPUT_PLACEHOLDERS[currentPlaceholderIndex] }}
          </span>
        </Transition>
      </div>
      <div class="flex justify-between items-center gap-2 w-full">
        <AIModelSelect v-model="modelType" />
        <div class="flex shrink-0 items-center gap-x-2">
          <button
            type="button"
            class="flex items-center justify-center z-2 size-8 rounded-md text-gray-500 transition-colors hover:bg-gray-100"
            title="Голосовой ввод"
          >
            <Mic class="size-4.5" />
          </button>

          <Button
            size="sm"
            v-if="!isRunning"
          >
            <span class="text-xs">Отправить</span>
            <Sparkles class="size-4" />
          </Button>

          <Button
            size="sm"
            class="text-xs font-medium"
            v-else
          >
            <span>Остановить</span>
            <Spinner class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
