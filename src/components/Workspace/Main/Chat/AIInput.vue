<script setup lang="ts">
import { useChatStore } from '@stores/chat'
import { useAgentStatusStore } from '@stores/agentStatus'
import { Square, MessageCircleQuestionMark, SquarePlay, ChevronDown } from 'lucide-vue-next'
import Sparkles from '@assets/sparkles.svg?component'
import { computed, ref } from 'vue'
import { useStopAgent } from '@/composables/chat/mutations/useStopAgent'
import { useChat } from '@/composables/chat/queries/useChat'
import MicButton from '@components/Workspace/Main/MicButton.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspaceStore } from '@/stores/workspace'
import { storeToRefs } from 'pinia'
import { useBoards } from '@/composables/boards/queries/useBoards'
import { cn } from '@/lib/utils'
import { SquareKanban } from 'lucide-vue-next'

const workspaceStore = useWorkspaceStore()

const { activeWorkspaceId } = storeToRefs(workspaceStore)

const { data: boardsData } = useBoards(activeWorkspaceId)

const boards = computed(() => boardsData.value || [])

const isContextSelectOpen = ref(false)
const isTypeSelectOpen = ref(false)
const selectedType = ref<'question' | 'task'>('task')

const props = defineProps<{
  isLastMessageFromHuman?: boolean
  isDisabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const message = ref<string>('')

const agentStatusStore = useAgentStatusStore()
const chatStore = useChatStore()

const { activeChat } = storeToRefs(chatStore)

const activeChatId = computed(() => activeChat.value?.id || null)
const activeChatWorkspaceId = computed(() => activeChat.value?.workspaceId || null)

const selectedBoardIds = ref<string[]>([])

const chat = useChat(activeChatId, activeChatWorkspaceId)
const { mutate: stopAgent } = useStopAgent()

const boardLabel = computed(() => (count: number) => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'доска'
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'доски'
  } else {
    return 'досок'
  }
})

function toggleBoardSelection(boardId: string, checked: boolean) {
  if (checked) {
    if (!selectedBoardIds.value.includes(boardId)) {
      selectedBoardIds.value.push(boardId)
    }
    return
  }

  selectedBoardIds.value = selectedBoardIds.value.filter((id) => id !== boardId)
}

function sendChatMessage() {
  emit('send', message.value.trim())

  message.value = ''
}

function handleStopAgent() {
  if (chat.value) {
    stopAgent({
      chatId: chat.value.id,
      threadId: chat.value.threadId,
    })
  }
}

const isRunButtonDisabled = computed(() => {
  return (
    agentStatusStore.isSSEActive() ||
    (props.isLastMessageFromHuman === false && message.value.trim() === '')
  )
})

const boardName = computed(() => (id: string) => {
  const board = boards.value.find((b) => b.id === id)
  return board ? board.name : 'Все доски'
})
</script>

<template>
  <div class="w-full mt-1 relative p-2 rounded-md bg-white border border-gray-200">
    <div class="flex flex-col gap-x-1 items-end">
      <div class="w-full flex items-center">
        <Textarea
          class="p-0 border-none shadow-none min-h-12"
          placeholder="Создай задачу..."
          v-model="message"
        />
      </div>
      <div class="flex justify-between items-center gap-2 w-full">
        <div class="flex min-w-0 items-center gap-2">
          <Select v-model:open="isTypeSelectOpen" v-model="selectedType">
            <SelectTrigger
              :class="
                cn(
                  'border flex shadow-none h-8 text-xs rounded-sm font-medium gap-2 focus:ring-0 hover:bg-accent justify-start',
                  isTypeSelectOpen && 'text-foreground bg-accent',
                )
              "
              :is-open="isTypeSelectOpen"
            >
              <MessageCircleQuestionMark
                class="size-4 shrink-0"
                v-if="selectedType === 'question'"
              />
              <SquarePlay class="size-4 shrink-0" v-if="selectedType === 'task'" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup class="p-0">
                <SelectItem value="question">
                  <div class="flex items-center gap-x-2">
                    <MessageCircleQuestionMark class="size-4 shrink-0" /><span>Вопрос</span>
                  </div>
                </SelectItem>
                <SelectItem value="task">
                  <div class="flex items-center gap-x-2">
                    <SquarePlay class="size-4 shrink-0" /><span>Задача</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DropdownMenu v-model:open="isContextSelectOpen">
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                :class="
                  cn(
                    'max-w-50 border flex w-auto shadow-none h-8 text-xs rounded-sm font-medium gap-2 focus:ring-0 hover:bg-accent',
                    selectedBoardIds.length === 0 && 'text-muted-foreground',
                    isContextSelectOpen && 'text-foreground bg-accent',
                  )
                "
              >
                <SquareKanban class="size-4 shrink-0" />
                <span class="truncate" v-if="selectedBoardIds.length > 1"
                  >{{ selectedBoardIds.length }} {{ boardLabel(selectedBoardIds.length) }}</span
                >
                <span class="truncate" v-if="selectedBoardIds.length === 1">{{
                  boardName(selectedBoardIds[0])
                }}</span>
                <span class="truncate" v-if="selectedBoardIds.length === 0">Все доски</span>
                <ChevronDown
                  class="size-4 shrink-0 transition-transform duration-200"
                  :class="{ '-rotate-180': isContextSelectOpen }"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="start">
              <DropdownMenuCheckboxItem
                v-for="board in boards"
                :key="board.id"
                :model-value="selectedBoardIds.includes(board.id)"
                @update:model-value="(checked: boolean) => toggleBoardSelection(board.id, checked)"
                @select.prevent
              >
                {{ board.name }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                sendChatMessage()
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
            :disabled="isRunButtonDisabled"
            v-if="!agentStatusStore.isSSEActive()"
            @click="sendChatMessage()"
          >
            <Sparkles class="size-4" />
          </Button>

          <Button size="icon-sm" class="text-xs font-medium" v-else @click="handleStopAgent()">
            <Square class="size-3.5" fill="#FFFFFF" />
            <span>{{ agentStatusStore.formattedTime }}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
