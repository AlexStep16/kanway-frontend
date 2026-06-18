<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { RefreshCcw, CircleAlert, Square } from 'lucide-vue-next'
import type { IUpdateEntitiesContent } from '~/interfaces/Statuses/Content/IUpdateEntitiesContent'
import ApproveButtons from '../../ApproveButtons.vue'
import ChatLog from '../../../../../ChatLog.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IUpdateEntitiesContent
  stateClasses: Record<string, boolean>
  nounTitlesProcessing: [string, string, string]
  nounTitlesCompleted: [string, string, string]
}>()

const processingTitles = ['Обновляю', 'Обновляю', 'Обновляю']
const completedTitles = ['Обновлена', 'Обновлены', 'Обновлено']

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(props.content.count, completedTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(props.content.count, processingTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <UpdateInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-updates="props.content.filters"
      :state-classes="stateClasses"
    >
      <template #icon>
        <RefreshCcw
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </UpdateInProgress>

    <UpdateInProgressAwaiting
      v-else-if="props.state === StatusStatesEnum.AWAITING_CONFIRMATION"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-updates="props.content.filters"
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
    </UpdateInProgressAwaiting>

    <UpdateCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && props.content.logId"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="stateClasses"
    >
      <template #icon>
        <RefreshCcw
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <ChatLog
        :logId="props.content.logId"
        v-if="props.content.logId"
      />
    </UpdateCompletedDropdown>

    <UpdateCompletedStatic
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
      :pluralized-title="pluralizedCompletedTitle"
    >
      <template #icon>
        <RefreshCcw
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </UpdateCompletedStatic>

    <UpdateCompletedStatic
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
      :pluralized-title="pluralizedProcessTitle"
    >
      <template #icon>
        <div class="size-3 flex items-center justify-center">
          <Square
            class="size-2.5"
            fill="currentColor"
          />
        </div>
      </template>
    </UpdateCompletedStatic>

    <ToolCallFailedBase
      v-else-if="props.state === StatusStatesEnum.FAILED"
      :title="pluralizedProcessTitle"
      :state-classes="stateClasses"
    />
  </div>
</template>
