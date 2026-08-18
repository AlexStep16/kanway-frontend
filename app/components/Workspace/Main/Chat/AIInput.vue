<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import ChatGPT from '~/assets/chatgpt.svg?skipsvgo'
import Recording from '~/components/Workspace/Main/Recording/Recording.vue'
import { cn } from '~/lib/utils'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'
import { AI_INPUT_PLACEHOLDERS } from '~/constants/AI_INPUT_PLACEHOLDERS'

const { data: user } = useUser()

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

const update = ref(() => {})

const isModelTypeSelectOpen = ref(false)

async function sendChatMessage() {
  const message = aiInputMessage.value.trim()

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
    chatStore.modelType === ModelsEnum.GPT_4O_TRANSCRIBE ||
    chatStore.modelType === ModelsEnum.GPT_5_4_NANO ||
    chatStore.modelType === ModelsEnum.GPT_5_4_MINI ||
    chatStore.modelType === ModelsEnum.GPT_5_4 ||
    chatStore.modelType === ModelsEnum.GPT_5_5
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

const handleEnterPress = () => {
  if (isRunButtonDisabled.value) {
    return
  }

  sendChatMessage()
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
          v-model="aiInputMessage"
          :ref="(el) => handleTextareaRef(el as any)"
          @keydown.enter.exact.prevent="handleEnterPress"
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
          <Select
            v-model:open="isModelTypeSelectOpen"
            v-model="chatStore.modelType"
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent :body-lock="false">
              <SelectGroup class="p-0 text-muted-foreground">
                <SelectItem
                  :value="ModelsEnum.GPT_5_4_MINI"
                  :class="
                    cn(
                      'focus:text-primary',
                      chatStore.modelType === ModelsEnum.GPT_5_4_MINI && 'text-primary',
                    )
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <ChatGPT class="size-4 shrink-0" /><span>GPT 5.4 Mini</span>
                  </div>
                </SelectItem>
                <SelectItem
                  :disabled="isUserBasic"
                  :value="ModelsEnum.GPT_5_4"
                  :class="
                    cn(
                      'focus:text-primary',
                      chatStore.modelType === ModelsEnum.GPT_5_4 && 'text-primary',
                    )
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <ChatGPT class="size-4 shrink-0" /><span>GPT 5.4</span>
                    <span
                      class="rounded-sm font-medium text-[10px] text-white py-0.5 px-1 bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)]"
                      v-if="isUserBasic"
                    >
                      PRO
                    </span>
                  </div>
                </SelectItem>
                <SelectItem
                  :disabled="isUserBasic"
                  :value="ModelsEnum.GPT_5_5"
                  :class="
                    cn(
                      'focus:text-primary',
                      chatStore.modelType === ModelsEnum.GPT_5_5 && 'text-primary',
                    )
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <ChatGPT class="size-4 shrink-0" /><span>GPT 5.5</span>
                    <span
                      class="rounded-sm font-medium text-[10px] text-white py-0.5 px-1 bg-[linear-gradient(338deg,#8ab6ff_0%,#69a2ff_35%,#cfbbff_100%)] hover:bg-[linear-gradient(338deg,#77abff_0%,#4d91ff_35%,#b798ff_100%)]"
                      v-if="isUserBasic"
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
          <Recording
            ref="micButtonRef"
            @setMessage="setMessage"
          ></Recording>
          <Button
            size="sm"
            :disabled="isRunButtonDisabled"
            v-if="!agentStatusStore.isSSEActive()"
            @click="sendChatMessage"
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

<style scoped>
.placeholder-fade-enter-active,
.placeholder-fade-leave-active {
  transition: opacity 0.25s ease;
}

.placeholder-fade-enter-from,
.placeholder-fade-leave-to {
  opacity: 0;
}
</style>
