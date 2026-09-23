<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { CircleAlert, Square, Trash2, Archive } from '@lucide/vue'
import type { IDeleteArchiveEntitiesContent } from '~/interfaces/Statuses/Content/IDeleteArchiveEntitiesContent'
import ApproveButtons from '../../ApproveButtons.vue'
import ChatLog from '../../../../../ChatLog.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IDeleteArchiveEntitiesContent
  stateClasses: Record<string, boolean>
  isDemo?: boolean
  nounTitlesProcessing: [string, string, string]
  nounTitlesCompleted: [string, string, string]
}>()

const processingDeleteTitles = ['Удаляю', 'Удаляю', 'Удаляю']
const processingArchiveTitles = ['Архивирую', 'Архивирую', 'Архивирую']

const completedDeleteTitles = ['Удалена', 'Удалены', 'Удалено']
const completedArchiveTitles = ['Архивирована', 'Архивированы', 'Архивировано']

const pluralizedCompletedDeleteTitle = computed(() => {
  return `${pluralize(props.content.count, completedDeleteTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedCompletedArchiveTitle = computed(() => {
  return `${pluralize(props.content.count, completedArchiveTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedProcessingDeleteTitle = computed(() => {
  return `${pluralize(props.content.count, processingDeleteTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})

const pluralizedProcessingArchiveTitle = computed(() => {
  return `${pluralize(props.content.count, processingArchiveTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})

const pluralizedProcessingTitle = computed(() => {
  return props.content.isSoftDelete
    ? pluralizedProcessingArchiveTitle.value
    : pluralizedProcessingDeleteTitle.value
})

const pluralizedCompletedTitle = computed(() => {
  return props.content.isSoftDelete
    ? pluralizedCompletedArchiveTitle.value
    : pluralizedCompletedDeleteTitle.value
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <DeleteArchiveInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessingTitle"
      :human-readable-filters="props.content.filters"
      :state-classes="stateClasses"
    >
      <template #icon>
        <Trash2
          class="size-3"
          :class="props.stateClasses"
          v-if="!props.content.isSoftDelete"
        />
        <Archive
          class="size-3"
          :class="props.stateClasses"
          v-else
        />
      </template>
    </DeleteArchiveInProgress>

    <DeleteArchiveInProgressAwaiting
      v-else-if="props.state === StatusStatesEnum.AWAITING_CONFIRMATION"
      :pluralized-title="pluralizedProcessingTitle"
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
          v-if="props.content.logId && !props.isDemo"
        />

        <slot
          name="demo-log"
          v-else-if="props.isDemo"
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
    </DeleteArchiveInProgressAwaiting>

    <DeleteArchiveCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && props.content.logId"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="props.stateClasses"
    >
      <template #icon>
        <Trash2
          class="size-3"
          :class="props.stateClasses"
          v-if="!props.content.isSoftDelete"
        />
        <Archive
          class="size-3"
          :class="props.stateClasses"
          v-else
        />
      </template>
      <ChatLog
        :logId="props.content.logId"
        v-if="props.content.logId && !props.isDemo"
      />

      <slot
        name="demo-log"
        v-else-if="props.isDemo"
      />
    </DeleteArchiveCompletedDropdown>

    <DeleteArchiveCompletedStatic
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
      :pluralized-title="pluralizedCompletedTitle"
    >
      <template #icon>
        <Trash2
          class="size-3"
          :class="props.stateClasses"
          v-if="!props.content.isSoftDelete"
        />
        <Archive
          class="size-3"
          :class="props.stateClasses"
          v-else
        />
      </template>
    </DeleteArchiveCompletedStatic>

    <DeleteArchiveCompletedStatic
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
      :pluralized-title="pluralizedProcessingTitle"
    >
      <template #icon>
        <div class="size-3 flex items-center justify-center">
          <Square
            class="size-2.5"
            fill="currentColor"
          />
        </div>
      </template>
    </DeleteArchiveCompletedStatic>

    <ToolCallFailedBase
      v-else-if="props.state === StatusStatesEnum.FAILED"
      :title="pluralizedProcessingTitle"
      :state-classes="stateClasses"
    />
  </div>
</template>
