<script setup lang="ts">
import Sparkles from '~/assets/sparkles.svg?skipsvgo'
import MicButton from '~/components/Workspace/Main/MicButton.vue'
import { Feather, Flame } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { ModelsEnum } from '~/enums/ModelsEnum'
import { SubscriptionPlanEnum } from '~/enums/SubscriptionPlanEnum'

const { data: user } = useUser()

const chatStore = useChatStore()

const { aiInputMessage } = storeToRefs(chatStore)

const aiInputMessageRef = ref<HTMLTextAreaElement | null>(null)

const props = defineProps<{
  isDisabled?: boolean
  isFocused?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', aiInputMessage: string): void
  (e: 'stop'): void
}>()

const update = ref(() => {})

const agentStatusStore = useAgentStatusStore()

const isModelTypeSelectOpen = ref(false)

function sendChatMessage() {
  emit('send', aiInputMessage.value.trim())

  aiInputMessage.value = ''
  if (aiInputMessageRef.value) aiInputMessageRef.value.blur()
}

function handleTextareaRef(
  el: {
    textareaRef: HTMLTextAreaElement | null
    update: () => void
  } | null,
) {
  if (el && el.textareaRef) {
    aiInputMessageRef.value = el.textareaRef
    update.value = el.update
    if (props.isFocused) aiInputMessageRef.value.focus()
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
  return props.isDisabled || !aiInputMessage.value.trim() || agentStatusStore.isSSEActive()
})

const isUserBasic = computed(() => {
  return user.value?.subscriptionId === SubscriptionPlanEnum.Basic
})

defineExpose({
  setMessage,
  updateTextarea,
})
</script>

<template>
  <div class="w-full relative p-2 rounded-md bg-white border border-gray-200">
    <div class="flex flex-col gap-1 items-end">
      <div class="w-full flex items-center">
        <Textarea
          class="p-0 border-none shadow-none min-h-12"
          placeholder="Опиши проект или просто выгрузи мысли..."
          v-model="aiInputMessage"
          :ref="(el) => handleTextareaRef(el as any)"
        />
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
                  'border flex shadow-none h-8 text-xs text-muted-foreground rounded-sm font-medium gap-2 focus:ring-0 hover:bg-accent justify-start px-2',
                )
              "
              :is-open="isModelTypeSelectOpen"
            >
              <Feather
                class="size-4 shrink-0"
                v-if="chatStore.modelType === ModelsEnum.KANWAY_LITE"
              />
              <Flame
                class="size-4 shrink-0"
                v-if="chatStore.modelType === ModelsEnum.KANWAY_PRO"
              />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup class="p-0 text-muted-foreground">
                <SelectItem
                  :value="ModelsEnum.KANWAY_LITE"
                  :class="
                    cn(
                      'focus:text-primary',
                      chatStore.modelType === ModelsEnum.KANWAY_LITE && 'text-primary',
                    )
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <Feather class="size-4 shrink-0" /><span>Kanway Lite</span>
                  </div>
                </SelectItem>
                <SelectItem
                  :disabled="isUserBasic"
                  :value="ModelsEnum.KANWAY_PRO"
                  :class="
                    cn(
                      'focus:text-primary',
                      chatStore.modelType === ModelsEnum.KANWAY_PRO && 'text-primary',
                    )
                  "
                >
                  <div class="flex items-center gap-x-2">
                    <Flame class="size-4 shrink-0" /><span>Kanway Pro</span>
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
          <MicButton
            @deltaAdd="
              (deltaText: string) => {
                aiInputMessage += deltaText
              }
            "
            @transcriptionCompleted="
              (finalText: string) => {
                aiInputMessage = finalText
              }
            "
            @clearInput="
              () => {
                aiInputMessage = ''
              }
            "
          ></MicButton>
          <Button
            size="sm"
            class=""
            :disabled="isRunButtonDisabled"
            v-if="!agentStatusStore.isSSEActive()"
            @click="sendChatMessage()"
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
