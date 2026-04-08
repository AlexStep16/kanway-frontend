<script setup lang="ts">
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import Sparkles from '@assets/sparkles.svg?component'
import { computed, ref } from 'vue'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import MicButton from '@components/Workspace/Main/MicButton.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Button from '@/components/ui/button/Button.vue'
import { storeToRefs } from 'pinia'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Zap, Brain } from 'lucide-vue-next'
import Spinner from '@/components/ui/spinner/Spinner.vue'
import { cn } from '@/lib/utils'

const messageRef = ref<HTMLTextAreaElement | null>(null)

const props = defineProps<{
  isDisabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const message = ref<string>('')

const agentStatusStore = useAgentStatusStore()
const chatStore = useChatStore()

const { activeChatId } = storeToRefs(chatStore)

const { mutate: stopAgent, isPending: isStoppingAgent } = useStopAgent()

const isModelTypeSelectOpen = ref(false)
const selectedModelType = ref<'fast' | 'thinking'>('fast')

function sendChatMessage() {
  emit('send', message.value.trim())

  message.value = ''
}

function handleStopAgent() {
  if (activeChatId.value && agentStatusStore.activeJobId) {
    if (chatStore.isActiveChatTemporary) {
      agentStatusStore.isInterrupted = true
    } else {
      stopAgent({
        chatId: activeChatId.value,
        jobId: agentStatusStore.activeJobId,
      })
    }
  }
}

function handleTextareaRef(
  el: {
    textareaRef: HTMLTextAreaElement | null
  } | null,
) {
  if (el && el.textareaRef) {
    messageRef.value = el.textareaRef
    messageRef.value.focus()
  }
}

function setMessage(newMessage: string) {
  message.value = newMessage
}

defineExpose({
  setMessage,
})
</script>

<template>
  <div class="w-full relative p-2 rounded-md bg-white border border-gray-200">
    <div class="flex flex-col gap-1 items-end">
      <div class="w-full flex items-center">
        <Textarea
          class="p-0 border-none shadow-none min-h-12"
          placeholder="Опиши проект или просто выгрузи мысли..."
          v-model="message"
          :ref="(el) => handleTextareaRef(el as any)"
        />
      </div>
      <div class="flex justify-between items-center gap-2 w-full">
        <div class="flex min-w-0 items-center gap-2">
          <Select v-model:open="isModelTypeSelectOpen" v-model="selectedModelType">
            <SelectTrigger
              :class="
                cn(
                  'border flex shadow-none h-8 text-xs text-muted-foreground rounded-sm font-medium gap-2 focus:ring-0 hover:bg-accent hover:text-primary justify-start px-2',
                  isModelTypeSelectOpen && 'text-primary bg-accent',
                )
              "
              :is-open="isModelTypeSelectOpen"
            >
              <Zap class="size-4 shrink-0" v-if="selectedModelType === 'fast'" />
              <Brain class="size-4 shrink-0" v-if="selectedModelType === 'thinking'" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup class="p-0 text-muted-foreground">
                <SelectItem value="fast" class="focus:text-primary">
                  <div class="flex items-center gap-x-2">
                    <Zap class="size-4 shrink-0" /><span>Быстрый</span>
                  </div>
                </SelectItem>
                <SelectItem value="thinking" class="focus:text-primary">
                  <div class="flex items-center gap-x-2">
                    <Brain class="size-4 shrink-0" /><span>Думающий</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex shrink-0 items-center gap-x-2">
          <MicButton
            :isChat="true"
            :isDisabled="isDisabled"
            @deltaAdd="
              (deltaText: string) => {
                message += deltaText
              }
            "
            @transcriptionCompleted="
              (finalText: string) => {
                message = finalText
              }
            "
            @clearInput="
              () => {
                message = ''
              }
            "
          ></MicButton>
          <Button
            size="sm"
            :disabled="message.trim() === '' || isDisabled"
            v-if="!agentStatusStore.isSSEActive()"
            @click="sendChatMessage()"
          >
            <span class="text-xs">Отправить</span>
            <Sparkles class="size-4" />
          </Button>

          <Button
            size="sm"
            class="text-xs font-medium"
            v-else-if="!agentStatusStore.isInterrupted"
            @click="handleStopAgent()"
          >
            <span>Остановить</span>
            <Spinner class="size-4" />
          </Button>

          <Button
            size="sm"
            class="text-xs font-medium"
            v-else-if="agentStatusStore.isInterrupted"
            disabled
          >
            <span>Остановка...</span>
            <Spinner class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
