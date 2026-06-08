<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { SquarePlus, CircleAlert, Square } from 'lucide-vue-next'
import type { ICreateEntitiesContent } from '~/interfaces/Statuses/Content/ICreateEntitiesContent'
import ApproveButtons from '../../ApproveButtons.vue'
import ChatLog from '../../../../../ChatLog.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: ICreateEntitiesContent
  stateClasses: Record<string, boolean>
  nounTitlesProcessing: [string, string, string]
  nounTitlesCompleted: [string, string, string]
}>()

const processingTitles = ['Создаю', 'Создаю', 'Создаю']
const completedTitles = ['Создана', 'Созданы', 'Создано']

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(props.content.count, completedTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(props.content.count, processingTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <CreateInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-filters="[]"
      :state-classes="stateClasses"
    >
      <template #icon>
        <SquarePlus
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </CreateInProgress>

    <CreateInProgressAwaiting
      v-else-if="props.state === StatusStatesEnum.AWAITING_CONFIRMATION"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-filters="[]"
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
    </CreateInProgressAwaiting>

    <CreateCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && props.content.count"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="stateClasses"
    >
      <template #icon>
        <SquarePlus
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <ChatLog
        :logId="props.content.logId"
        v-if="props.content.logId"
      />
    </CreateCompletedDropdown>

    <CreateCompletedStatic
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
      :pluralized-title="pluralizedCompletedTitle"
    >
      <template #icon>
        <SquarePlus
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </CreateCompletedStatic>

    <CreateCompletedStatic
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
      :pluralized-title="pluralizedProcessTitle"
    >
      <template #icon>
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
    </CreateCompletedStatic>

    <ToolCallFailedBase
      v-else-if="props.state === StatusStatesEnum.FAILED"
      :title="pluralizedProcessTitle"
      :state-classes="stateClasses"
    />
  </div>
</template>
