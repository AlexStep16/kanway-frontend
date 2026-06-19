<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import ChatGPT from '~/assets/chatgpt.svg?skipsvgo'
import { Mic } from 'lucide-vue-next'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { cn } from '~/lib/utils'

defineProps<{
  isRunning: boolean
}>()

const aiInputMessage = defineModel<string>('aiInputMessage', { default: '' })
const modelType = ref<ModelsEnum>(ModelsEnum.GPT_5_4_MINI)
const isModelTypeSelectOpen = ref(false)
const aiInputMessageRef = ref<HTMLTextAreaElement | null>(null)

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

const isGPTModel = computed(() => {
  return (
    modelType.value === ModelsEnum.GPT_4O_TRANSCRIBE ||
    modelType.value === ModelsEnum.GPT_5_4_NANO ||
    modelType.value === ModelsEnum.GPT_5_4_MINI ||
    modelType.value === ModelsEnum.GPT_5_4 ||
    modelType.value === ModelsEnum.GPT_5_5
  )
})

function updateTextarea() {
  if (update.value) {
    update.value()
  }
}

defineExpose({
  updateTextarea,
})
</script>

<template>
  <div
    class="w-full relative p-2.5 rounded-xl bg-white/95 border border-zinc-200/80 shadow-sm ring-1 ring-black/2"
  >
    <div class="flex flex-col gap-2 items-end">
      <div class="w-full flex items-center">
        <Textarea
          class="p-0 border-none shadow-none min-h-12 rounded-none placeholder:text-zinc-400"
          placeholder="Опиши проект или просто выгрузи мысли..."
          v-model="aiInputMessage"
          :ref="(el) => handleTextareaRef(el as any)"
        />
      </div>
      <div class="flex justify-between items-center gap-2 w-full">
        <div class="flex min-w-0 items-center gap-2">
          <Select
            v-model:open="isModelTypeSelectOpen"
            v-model="modelType"
          >
            <SelectTrigger
              class="w-full items-center whitespace-nowrap border-zinc-200 bg-zinc-50/80 py-2 ring-offset-background data-placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300/60 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start border flex shadow-sm h-8 text-xs text-zinc-600 rounded-lg font-medium gap-2 hover:bg-zinc-100/80 justify-start px-2.5 transition-all duration-200"
              :is-open="isModelTypeSelectOpen"
            >
              <ChatGPT
                class="size-4 shrink-0"
                v-if="isGPTModel"
              />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup class="p-0 text-muted-foreground">
                <SelectItem
                  :value="ModelsEnum.GPT_5_4_MINI"
                  :class="
                    cn(
                      'focus:text-primary',
                      modelType === ModelsEnum.GPT_5_4_MINI && 'text-primary',
                    )
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <ChatGPT class="size-4 shrink-0" /><span>GPT 5.4 Mini</span>
                  </div>
                </SelectItem>
                <SelectItem
                  :value="ModelsEnum.GPT_5_4"
                  :class="
                    cn('focus:text-primary', modelType === ModelsEnum.GPT_5_4 && 'text-primary')
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <ChatGPT class="size-4 shrink-0" /><span>GPT 5.4</span>
                    <span
                      class="rounded-sm font-medium text-[10px] text-white py-0.5 px-1 bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)]"
                    >
                      PRO
                    </span>
                  </div>
                </SelectItem>
                <SelectItem
                  :value="ModelsEnum.GPT_5_5"
                  :class="
                    cn('focus:text-primary', modelType === ModelsEnum.GPT_5_5 && 'text-primary')
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <ChatGPT class="size-4 shrink-0" /><span>GPT 5.5</span>
                    <span
                      class="rounded-sm font-medium text-[10px] text-white py-0.5 px-1 bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)]"
                    >
                      PRO
                    </span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
