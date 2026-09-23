<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { CircleAlert, Square, ArchiveRestore } from '@lucide/vue'
import type { IRecoverEntitiesContent } from '~/interfaces/Statuses/Content/IRecoverEntitiesContent'
import ChatLog from '../../../../../ChatLog.vue'
import ApproveButtons from '../../ApproveButtons.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IRecoverEntitiesContent
  stateClasses: Record<string, boolean>
  nounTitlesProcessing: [string, string, string]
  nounTitlesCompleted: [string, string, string]
}>()

const processingTitles = ['Восстанавливаю', 'Восстанавливаю', 'Восстанавливаю']
const completedTitles = ['Восстановлена', 'Восстановлены', 'Восстановлено']

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(props.content.count, completedTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(props.content.count, processingTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <RecoverInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-filters="props.content.filters"
      :state-classes="stateClasses"
    >
      <template #icon>
        <ArchiveRestore
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </RecoverInProgress>

    <RecoverInProgressAwaiting
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
    </RecoverInProgressAwaiting>

    <RecoverCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && props.content.logId"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="props.stateClasses"
    >
      <template #icon>
        <ArchiveRestore
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <ChatLog
        :logId="props.content.logId"
        v-if="props.content.logId"
      />
    </RecoverCompletedDropdown>

    <RecoverCompletedStatic
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
      :pluralized-title="pluralizedCompletedTitle"
    >
      <template #icon>
        <ArchiveRestore
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </RecoverCompletedStatic>

    <RecoverCompletedStatic
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
    </RecoverCompletedStatic>

    <ToolCallFailedBase
      v-else-if="props.state === StatusStatesEnum.FAILED"
      :title="pluralizedProcessTitle"
      :state-classes="stateClasses"
    />
  </div>
</template>
