<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { CircleAlert, Square, Undo2 } from 'lucide-vue-next'
import type { ITextValue } from '~/interfaces/Statuses/Content/ITextValue.js'

const props = defineProps<{
  toolId: string
  chatId: string
  threadId: string
  statusLogId: string
  isDemo: boolean
  state: StatusStatesEnum
  content: ITextValue[]
  stateClasses: Record<string, boolean>
}>()

const processTitle = 'Отменяю операции'
const completedTitle = 'Операции отменены'
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <ToolCallInProgressBase
      :title="processTitle"
      :state-classes="stateClasses"
      :items="content"
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
    >
      <template #icon>
        <Undo2
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </ToolCallInProgressBase>
    <ToolCallInProgressAwaitingStaticBase
      :title="processTitle"
      :state-classes="stateClasses"
      :items="content"
      accordion-item-value="undo-in-progress-awaiting"
      v-else-if="props.state === StatusStatesEnum.AWAITING_CONFIRMATION"
    >
      <template #icon>
        <CircleAlert
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <template #actions>
        <ApproveButtons
          :tool-id="props.toolId"
          :chat-id="props.chatId"
          :thread-id="props.threadId"
          :status-log-id="props.statusLogId"
          :is-demo="props.isDemo"
        />
      </template>
    </ToolCallInProgressAwaitingStaticBase>

    <ToolCallCompletedDropdownBase
      :pluralized-title="completedTitle"
      :state-classes="stateClasses"
      accordion-item-value="undo-completed"
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
    >
      <template #icon>
        <Undo2
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <ToolCallFiltersList :items="content" />
    </ToolCallCompletedDropdownBase>

    <ToolCallCompletedDropdownBase
      :pluralized-title="completedTitle"
      :state-classes="stateClasses"
      accordion-item-value="undo-completed"
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
    >
      <template #icon>
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
      <ToolCallFiltersList :items="content" />
    </ToolCallCompletedDropdownBase>
  </div>
</template>
