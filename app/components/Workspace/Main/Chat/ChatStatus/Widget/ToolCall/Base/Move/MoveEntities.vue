<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { CircleAlert, Square, ArrowLeftRight } from 'lucide-vue-next'
import type { IMoveEntitiesContent } from '~/interfaces/Statuses/Content/IMoveEntitiesContent'
import ChatLog from '../../../../../ChatLog.vue'
import ApproveButtons from '../../ApproveButtons.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IMoveEntitiesContent
  stateClasses: Record<string, boolean>
  nounTitlesProcessing: [string, string, string]
  nounTitlesCompleted: [string, string, string]
}>()

const processingTitles = ['Перемещаю', 'Перемещаю', 'Перемещаю']
const completedTitles = ['Перемещена', 'Перемещены', 'Перемещено']

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(props.content.count, completedTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(props.content.count, processingTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <MoveInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-filters="props.content.filters"
      :state-classes="stateClasses"
    >
      <template #icon>
        <ArrowLeftRight
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </MoveInProgress>

    <MoveInProgressAwaiting
      v-else-if="props.state === StatusStatesEnum.AWAITING_CONFIRMATION"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-filters="props.content.filters"
      :state-classes="stateClasses"
    >
      <template #icon>
        <CircleAlert
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <template #log>
        <ChatLog
          :logId="props.content.logId"
          v-if="props.content.logId"
        />
      </template>
      <template #actions>
        <ApproveButtons
          :tool-id="props.toolId"
          :chat-id="props.chatId"
          :thread-id="props.threadId"
          :status-log-id="props.statusLogId"
        />
      </template>
    </MoveInProgressAwaiting>

    <MoveCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && props.content.count"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="stateClasses"
    >
      <template #icon>
        <ArrowLeftRight
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <ChatLog
        :logId="props.content.logId"
        v-if="props.content.logId"
      />
    </MoveCompletedDropdown>

    <MoveCompletedStatic
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
      :pluralized-title="pluralizedCompletedTitle"
    >
      <template #icon>
        <ArrowLeftRight
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </MoveCompletedStatic>

    <MoveCompletedStatic
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
      :pluralized-title="pluralizedProcessTitle"
    >
      <template #icon>
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
    </MoveCompletedStatic>

    <ToolCallFailedBase
      v-else-if="props.state === StatusStatesEnum.FAILED"
      :title="pluralizedProcessTitle"
      :state-classes="stateClasses"
    />
  </div>
</template>
