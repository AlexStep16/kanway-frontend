<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { Copy, CircleAlert, Square } from 'lucide-vue-next'
import type { ICloneEntitiesContent } from '~/interfaces/Statuses/Content/ICloneEntitiesContent'
import ChatLog from '../../../../../ChatLog.vue'
import ApproveButtons from '../../ApproveButtons.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: ICloneEntitiesContent
  stateClasses: Record<string, boolean>
  nounTitlesProcessing: [string, string, string]
  nounTitlesCompleted: [string, string, string]
}>()

const processingTitles = ['Копирую', 'Копирую', 'Копирую']
const completedTitles = ['Скопирована', 'Скопированы', 'Скопировано']

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(props.content.count, completedTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(props.content.count, processingTitles)} ${props.content.count} ${pluralize(props.content.count, props.nounTitlesProcessing)}`
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <CloneInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessTitle"
      :human-readable-filters="props.content.filters"
      :state-classes="stateClasses"
    >
      <template #icon>
        <Copy
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </CloneInProgress>

    <CloneInProgressAwaiting
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
    </CloneInProgressAwaiting>

    <CloneCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && props.content.count"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="props.stateClasses"
    >
      <template #icon>
        <Copy
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <ChatLog
        :logId="props.content.logId"
        v-if="props.content.logId"
      />
    </CloneCompletedDropdown>

    <CloneCompletedStatic
      v-else-if="props.state === StatusStatesEnum.COMPLETED"
      :pluralized-title="pluralizedCompletedTitle"
    >
      <template #icon>
        <Copy
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
    </CloneCompletedStatic>

    <CloneCompletedStatic
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
      :pluralized-title="pluralizedProcessTitle"
    >
      <template #icon>
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
    </CloneCompletedStatic>
  </div>
</template>
