<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import ChatGPT from '~/assets/chatgpt.svg?skipsvgo'
import Gemini from '~/assets/google-color.svg?skipsvgo'
import { Brain, Mic, Zap } from '@lucide/vue'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { cn } from '~/lib/utils'
import { AI_INPUT_PLACEHOLDERS } from '~/constants/AI_INPUT_PLACEHOLDERS'
import { AI_MODEL_OPTIONS } from '~/constants/AI_MODEL_OPTIONS'

defineProps<{
  isRunning: boolean
}>()

const aiInputMessage = defineModel<string>('aiInputMessage', { default: '' })
const modelType = ref<ModelsEnum>(ModelsEnum.GPT_5_4_MINI)
const isModelTypeSelectOpen = ref(false)
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

const isGPTModel = computed(() => {
  return (
    modelType.value === ModelsEnum.GPT_TRANSCRIBE ||
    modelType.value === ModelsEnum.GPT_5_6_LUNA ||
    modelType.value === ModelsEnum.GPT_5_4_NANO ||
    modelType.value === ModelsEnum.GPT_5_4_MINI ||
    modelType.value === ModelsEnum.GPT_5_4 ||
    modelType.value === ModelsEnum.GPT_5_5
  )
})

const isGoogleModel = computed(() => {
  return (
    modelType.value === ModelsEnum.GEMINI_3_7_FLASH ||
    modelType.value === ModelsEnum.GEMINI_3_1_PRO_PREVIEW
  )
})

const currentModelLabel = computed(() => {
  return AI_MODEL_OPTIONS.find((model) => model.value === modelType.value)?.label ?? ''
})

const standardModels = computed(() => AI_MODEL_OPTIONS.filter((model) => !model.isPro))
const proModels = computed(() => AI_MODEL_OPTIONS.filter((model) => model.isPro))

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
        <div class="flex min-w-0 items-center gap-2">
          <Select
            v-model:open="isModelTypeSelectOpen"
            v-model="modelType"
          >
            <SelectTrigger
              :class="
                cn(
                  'w-full items-center whitespace-nowrap border-zinc-200 bg-zinc-50/80 py-2 ring-offset-background data-placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300/60 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start border flex shadow-sm h-8 text-xs text-zinc-600 rounded-lg font-medium gap-2 hover:bg-zinc-100/80 justify-start px-2.5 transition-all duration-200',
                )
              "
              :is-open="isModelTypeSelectOpen"
            >
              <ChatGPT
                class="size-4 shrink-0"
                v-if="isGPTModel"
              />
              <Gemini
                class="size-4 shrink-0"
                v-else-if="isGoogleModel"
              />
              <SelectValue>
                {{ currentModelLabel }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent :body-lock="false">
              <SelectGroup class="p-0 text-muted-foreground">
                <SelectLabel
                  class="px-2 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400"
                >
                  Стандартные
                </SelectLabel>
                <SelectItem
                  v-for="model in standardModels"
                  :key="model.value"
                  :value="model.value"
                  :hide-indicator="true"
                  :class="
                    cn(
                      'focus:text-primary min-w-54 [&>span:last-child]:w-full group/models',
                      modelType === model.value && 'text-primary',
                    )
                  "
                >
                  <div class="flex w-full flex-col gap-1">
                    <div class="flex items-center justify-between gap-x-2">
                      <div
                        :class="
                          cn(
                            'pl-2 border-l-3 border-muted-secondary flex items-center gap-x-2 group-hover/models:border-muted-foreground transition-colors duration-200',
                            modelType === model.value &&
                              'border-primary group-hover/models:border-primary',
                          )
                        "
                      >
                        <ChatGPT
                          v-if="model.provider === 'chatgpt'"
                          class="size-4 shrink-0"
                        />
                        <Gemini
                          v-else
                          class="size-4 shrink-0"
                        />
                        <span
                          :class="
                            cn(
                              'font-medium text-muted-foreground text-xs',
                              modelType === model.value && 'text-primary',
                            )
                          "
                          >{{ model.label }}</span
                        >
                      </div>
                      <span class="text-xs text-muted-foreground tabular-nums">{{
                        model.cost
                      }}</span>
                    </div>
                    <div class="flex items-center gap-x-1 pl-8.5 text-muted-foreground/90">
                      <span class="flex items-center gap-1">
                        <span class="flex items-center gap-0.5">
                          <Brain
                            v-for="i in model.smart"
                            :key="i"
                            class="size-3 shrink-0"
                          />
                        </span>
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <span class="flex items-center gap-0.5">
                          <Zap
                            v-for="i in model.fast"
                            :key="i"
                            class="size-3 shrink-0"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </SelectItem>
              </SelectGroup>
              <SelectSeparator />

              <SelectGroup class="p-0 text-muted-foreground">
                <SelectLabel
                  class="px-2 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400"
                >
                  Pro
                </SelectLabel>
                <SelectItem
                  v-for="model in proModels"
                  :key="model.value"
                  :value="model.value"
                  :hide-indicator="true"
                  :class="
                    cn(
                      'focus:text-primary [&>span:last-child]:w-full group/models',
                      modelType === model.value && 'text-primary',
                    )
                  "
                >
                  <div class="flex w-full flex-col gap-1">
                    <div class="flex items-center justify-between gap-x-2">
                      <div
                        :class="
                          cn(
                            'pl-2 border-l-3 border-muted-secondary flex items-center gap-x-2 group-hover/models:border-muted-foreground transition-colors duration-200',
                            modelType === model.value &&
                              'border-primary group-hover/models:border-primary',
                          )
                        "
                      >
                        <ChatGPT
                          v-if="model.provider === 'chatgpt'"
                          class="size-4 shrink-0"
                        />
                        <Gemini
                          v-else
                          class="size-4 shrink-0"
                        />
                        <span
                          :class="
                            cn(
                              'font-medium text-muted-foreground text-xs',
                              modelType === model.value && 'text-primary',
                            )
                          "
                          >{{ model.label }}</span
                        >
                      </div>
                      <span class="text-xs text-muted-foreground tabular-nums">{{
                        model.cost
                      }}</span>
                    </div>
                    <div class="flex items-center gap-x-1 pl-8.5 text-muted-foreground/90">
                      <span class="flex items-center gap-1">
                        <span class="flex items-center gap-0.5">
                          <Brain
                            v-for="i in model.smart"
                            :key="i"
                            class="size-3 shrink-0"
                          />
                        </span>
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <span class="flex items-center gap-0.5">
                          <Zap
                            v-for="i in model.fast"
                            :key="i"
                            class="size-3 shrink-0"
                          />
                        </span>
                      </span>
                    </div>
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
