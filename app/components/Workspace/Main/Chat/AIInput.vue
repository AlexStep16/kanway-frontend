<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import ChatGPT from '~/assets/chatgpt.svg?skipsvgo'
import Gemini from '~/assets/google-color.svg?skipsvgo'
import Recording from '~/components/Workspace/Main/Recording/Recording.vue'
import { cn } from '~/lib/utils'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { AI_INPUT_PLACEHOLDERS } from '~/constants/AI_INPUT_PLACEHOLDERS'
import { AI_MODEL_OPTIONS, type IAIModelOption } from '~/constants/AI_MODEL_OPTIONS'
import { Brain, Zap, ChevronDown, Check, Lock, ChevronsUp } from '@lucide/vue'

const { data: user } = useUser()

const uiStore = useUIStore()
const chatStore = useChatStore()
const agentStatusStore = useAgentStatusStore()

const { aiInputMessage } = storeToRefs(chatStore)

const aiInputMessageRef = ref<HTMLTextAreaElement | null>(null)
const micButtonRef = ref<InstanceType<typeof Recording> | null>(null)
const isTextareaInitialized = ref(false)

const currentPlaceholderIndex = ref(0)
let placeholderIntervalId: any = null

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

// Единое состояние открытия для Popover и Drawer
const isModelPickerOpen = ref(false)

async function sendChatMessage(message: string) {
  message = message.trim()

  if (!message) return

  emit('send', message)

  aiInputMessage.value = ''
  if (aiInputMessageRef.value) aiInputMessageRef.value.blur()
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

const isGPTModel = computed(() => {
  return (
    chatStore.modelType === ModelsEnum.GPT_TRANSCRIBE ||
    chatStore.modelType === ModelsEnum.GPT_5_6_LUNA ||
    chatStore.modelType === ModelsEnum.GPT_5_4_NANO ||
    chatStore.modelType === ModelsEnum.GPT_5_4_MINI ||
    chatStore.modelType === ModelsEnum.GPT_5_4 ||
    chatStore.modelType === ModelsEnum.GPT_5_5
  )
})

const isGoogleModel = computed(() => {
  return (
    chatStore.modelType === ModelsEnum.GEMINI_3_7_FLASH ||
    chatStore.modelType === ModelsEnum.GEMINI_3_8_FLASH ||
    chatStore.modelType === ModelsEnum.GEMINI_3_1_PRO_PREVIEW
  )
})

const isRunButtonDisabled = computed(() => {
  return (
    props.isDisabled ||
    (!aiInputMessage.value.trim() && !micButtonRef.value?.hasRecording) ||
    agentStatusStore.isSSEActive() ||
    !!micButtonRef.value?.isRecording ||
    !!micButtonRef.value?.isTranscribing
  )
})

const isUserBasic = computed(() => {
  return user.value?.subscriptionId === SubscriptionPlanEnum.Basic
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

const currentModel = computed(() => {
  return AI_MODEL_OPTIONS.find((model) => model.value === chatStore.modelType)
})

const standardModels = computed(() => AI_MODEL_OPTIONS.filter((model) => !model.isPro))
const proModels = computed(() => AI_MODEL_OPTIONS.filter((model) => model.isPro))

function selectModel(model: IAIModelOption, disabled = false) {
  if (disabled) return
  chatStore.modelType = model.value
  isModelPickerOpen.value = false
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

      <div class="flex justify-between items-center gap-2 w-full">
        <div class="flex min-w-0 items-center gap-2">
          <!-- ========================================================= -->
          <!-- 1. ДЕСКТОП: Компактный Popover + Tooltip                 -->
          <!-- ========================================================= -->
          <Popover
            v-if="!isMobile"
            v-model:open="isModelPickerOpen"
          >
            <PopoverTrigger as-child>
              <button
                type="button"
                :class="
                  cn(
                    'items-center whitespace-nowrap border-zinc-200 bg-zinc-50/80 py-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-zinc-300/60 text-start border flex shadow-sm h-8 text-xs text-zinc-700 rounded-lg font-medium gap-2 hover:bg-zinc-100/80 justify-between px-2.5 transition-all duration-200 cursor-pointer',
                  )
                "
              >
                <div class="flex items-center gap-2 truncate">
                  <ChatGPT
                    class="size-4 shrink-0"
                    v-if="isGPTModel"
                  />
                  <Gemini
                    class="size-4 shrink-0"
                    v-else-if="isGoogleModel"
                  />
                  <span class="truncate">{{ currentModel?.label }}</span>
                </div>
                <ChevronDown
                  class="size-3 text-zinc-400 shrink-0 ml-0.5 transition-transform duration-200"
                  :class="isModelPickerOpen ? 'rotate-180' : ''"
                />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              :side-offset="6"
              class="w-64 p-1 rounded-xl shadow-lg border border-zinc-200/80 bg-white"
              @open-auto-focus.prevent
            >
              <TooltipProvider :delay-duration="0">
                <!-- Стандартные модели -->
                <div
                  class="px-2 pt-1.5 pb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400"
                >
                  Стандартные
                </div>
                <div class="flex flex-col gap-0.5">
                  <Tooltip
                    v-for="model in standardModels"
                    :key="model.value"
                  >
                    <TooltipTrigger as-child>
                      <button
                        type="button"
                        @click="selectModel(model)"
                        :class="
                          cn(
                            'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-start cursor-pointer hover:bg-zinc-100/80',
                            chatStore.modelType === model.value &&
                              'bg-zinc-100 text-zinc-900 font-medium',
                          )
                        "
                      >
                        <div class="flex items-center gap-2">
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
                              chatStore.modelType === model.value
                                ? 'text-zinc-900 font-medium'
                                : 'text-zinc-600'
                            "
                          >
                            {{ model.label }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <span class="text-[11px] text-zinc-400 tabular-nums">{{
                            model.cost
                          }}</span>
                        </div>
                      </button>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      :side-offset="10"
                      class="z-70 flex flex-col gap-1.5 p-2 text-xs bg-zinc-900 text-white rounded-lg shadow-md border-none"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-zinc-400">Мышление:</span>
                        <div class="flex items-center gap-1">
                          <span class="flex items-center gap-0.5 text-zinc-100">
                            <Brain
                              v-for="i in model.smart"
                              :key="i"
                              class="size-3 shrink-0"
                            />
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-zinc-400">Скорость:</span>
                        <div class="flex items-center gap-1">
                          <span class="flex items-center gap-0.5 text-amber-400">
                            <Zap
                              v-for="i in model.fast"
                              :key="i"
                              class="size-3 shrink-0 fill-current"
                            />
                          </span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <!-- Разделитель -->
                <div class="my-1.5 border-t border-zinc-100" />

                <!-- Pro модели -->
                <div
                  class="px-2 pt-1 pb-1 text-[11px] font-medium text-zinc-400 flex items-center justify-between"
                >
                  <span class="uppercase tracking-wide">Pro</span>
                  <button
                    v-if="isUserBasic"
                    class="flex items-center gap-x-1 text-[10px] text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded cursor-pointer hover:bg-violet-200"
                    @click="uiStore.isPlansModalOpen = true"
                  >
                    <span>Повысить</span>
                    <ChevronsUp class="size-3" />
                  </button>
                </div>
                <div class="flex flex-col gap-0.5">
                  <Tooltip
                    v-for="model in proModels"
                    :key="model.value"
                  >
                    <TooltipTrigger as-child>
                      <button
                        type="button"
                        :disabled="isUserBasic"
                        @click="selectModel(model, isUserBasic)"
                        :class="
                          cn(
                            'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors text-start',
                            isUserBasic
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-zinc-100/80',
                            chatStore.modelType === model.value &&
                              'bg-zinc-100 text-zinc-900 font-medium',
                          )
                        "
                      >
                        <div class="flex items-center gap-2">
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
                              chatStore.modelType === model.value
                                ? 'text-zinc-900 font-medium'
                                : 'text-zinc-600'
                            "
                          >
                            {{ model.label }}
                          </span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <Lock
                            v-if="isUserBasic"
                            class="size-3 text-zinc-400"
                          />
                          <span class="text-[11px] text-zinc-400 tabular-nums">{{
                            model.cost
                          }}</span>
                        </div>
                      </button>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      :side-offset="10"
                      class="z-70 flex flex-col gap-1.5 p-2 text-xs bg-zinc-900 text-white rounded-lg shadow-md border-none"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-zinc-400">Мышление:</span>
                        <div class="flex items-center gap-1">
                          <span class="flex items-center gap-0.5 text-zinc-100">
                            <Brain
                              v-for="i in model.smart"
                              :key="i"
                              class="size-3 shrink-0"
                            />
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between gap-3">
                        <span class="text-zinc-400">Скорость:</span>
                        <div class="flex items-center gap-1">
                          <span class="flex items-center gap-0.5 text-amber-400">
                            <Zap
                              v-for="i in model.fast"
                              :key="i"
                              class="size-3 shrink-0 fill-current"
                            />
                          </span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </PopoverContent>
          </Popover>

          <Drawer
            v-else
            v-model:open="isModelPickerOpen"
          >
            <DrawerTrigger as-child>
              <button
                type="button"
                :class="
                  cn(
                    'items-center whitespace-nowrap border-zinc-200 bg-zinc-50/80 py-2 ring-offset-background text-start border flex shadow-sm h-8 text-xs text-zinc-700 rounded-lg font-medium gap-2 active:bg-zinc-100 justify-between px-2.5',
                  )
                "
              >
                <div class="flex items-center gap-2 truncate">
                  <ChatGPT
                    class="size-4 shrink-0"
                    v-if="isGPTModel"
                  />
                  <Gemini
                    class="size-4 shrink-0"
                    v-else-if="isGoogleModel"
                  />
                  <span class="truncate">{{ currentModel?.label }}</span>
                </div>
                <ChevronDown class="size-3 text-zinc-400 shrink-0 ml-0.5" />
              </button>
            </DrawerTrigger>

            <DrawerContent class="max-h-[85vh] flex flex-col overflow-hidden">
              <DrawerHeader class="px-5 py-4 text-left shrink-0">
                <DrawerTitle class="text-base font-semibold text-zinc-900">
                  Выбор модели
                </DrawerTitle>
                <DrawerDescription class="text-xs text-zinc-500">
                  Выберите модель под вашу задачу
                </DrawerDescription>
              </DrawerHeader>

              <div class="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-8 space-y-4">
                <div>
                  <div
                    class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2"
                  >
                    Стандартные
                  </div>
                  <div class="flex flex-col gap-2">
                    <div
                      v-for="model in standardModels"
                      :key="model.value"
                      @click="selectModel(model)"
                      :class="
                        cn(
                          'p-3 rounded-xl border transition-all flex flex-col gap-2.5 bg-white cursor-pointer select-none',
                          chatStore.modelType === model.value
                            ? 'border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50/60'
                            : 'border-zinc-200 active:bg-zinc-50',
                        )
                      "
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 min-w-0">
                          <ChatGPT
                            v-if="model.provider === 'chatgpt'"
                            class="size-4.5 shrink-0"
                          />
                          <Gemini
                            v-else
                            class="size-4.5 shrink-0"
                          />
                          <span class="font-medium text-sm text-zinc-900 truncate">{{
                            model.label
                          }}</span>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <span class="text-xs font-mono text-zinc-400">{{ model.cost }}</span>
                          <Check
                            v-if="chatStore.modelType === model.value"
                            class="size-4 text-zinc-900"
                          />
                        </div>
                      </div>

                      <div class="flex flex-col gap-1.5 pt-2 border-t border-zinc-100 text-xs">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-zinc-400 text-[11px]">Мышление</span>
                          <div class="flex items-center gap-1.5 shrink-0">
                            <div class="flex items-center gap-0.5 text-zinc-700">
                              <Brain
                                v-for="i in model.smart"
                                :key="i"
                                class="size-3 shrink-0"
                              />
                            </div>
                            <span class="text-[11px] text-zinc-500 font-medium"
                              >({{ model.smartLabel }})</span
                            >
                          </div>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                          <span class="text-zinc-400 text-[11px]">Скорость</span>
                          <div class="flex items-center gap-1.5 shrink-0">
                            <div class="flex items-center gap-0.5 text-amber-500">
                              <Zap
                                v-for="i in model.fast"
                                :key="i"
                                class="size-3 shrink-0 fill-current"
                              />
                            </div>
                            <span class="text-[11px] text-zinc-500 font-medium"
                              >({{ model.fastLabel }})</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between"
                  >
                    <span>Pro</span>
                    <span
                      v-if="isUserBasic"
                      class="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium"
                    >
                      Нужна подписка Pro
                    </span>
                  </div>
                  <div class="flex flex-col gap-2">
                    <div
                      v-for="model in proModels"
                      :key="model.value"
                      @click="selectModel(model, isUserBasic)"
                      :class="
                        cn(
                          'p-3 rounded-xl border transition-all flex flex-col gap-2.5 select-none',
                          isUserBasic
                            ? 'opacity-60 bg-zinc-50 border-zinc-200 cursor-not-allowed'
                            : 'bg-white cursor-pointer active:bg-zinc-50',
                          chatStore.modelType === model.value
                            ? 'border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50/60'
                            : 'border-zinc-200',
                        )
                      "
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 min-w-0">
                          <ChatGPT
                            v-if="model.provider === 'chatgpt'"
                            class="size-4.5 shrink-0"
                          />
                          <Gemini
                            v-else
                            class="size-4.5 shrink-0"
                          />
                          <span class="font-medium text-sm text-zinc-900 truncate">{{
                            model.label
                          }}</span>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <Lock
                            v-if="isUserBasic"
                            class="size-3.5 text-zinc-400"
                          />
                          <span class="text-xs font-mono text-zinc-400">{{ model.cost }}</span>
                          <Check
                            v-if="chatStore.modelType === model.value"
                            class="size-4 text-zinc-900"
                          />
                        </div>
                      </div>

                      <div class="flex flex-col gap-1.5 pt-2 border-t border-zinc-100 text-xs">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-zinc-400 text-[11px]">Мышление</span>
                          <div class="flex items-center gap-1.5 shrink-0">
                            <div class="flex items-center gap-0.5 text-zinc-700">
                              <Brain
                                v-for="i in model.smart"
                                :key="i"
                                class="size-3 shrink-0"
                              />
                            </div>
                            <span class="text-[11px] text-zinc-500 font-medium"
                              >({{ model.smartLabel }})</span
                            >
                          </div>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                          <span class="text-zinc-400 text-[11px]">Скорость</span>
                          <div class="flex items-center gap-1.5 shrink-0">
                            <div class="flex items-center gap-0.5 text-amber-500">
                              <Zap
                                v-for="i in model.fast"
                                :key="i"
                                class="size-3 shrink-0 fill-current"
                              />
                            </div>
                            <span class="text-[11px] text-zinc-500 font-medium"
                              >({{ model.fastLabel }})</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

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
