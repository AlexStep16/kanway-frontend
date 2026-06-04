<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { CircleAlert, Square, ArchiveRestore } from 'lucide-vue-next'
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

const ids = computed(() => {
  return props.content.ids || []
})

const idsCount = computed(() => ids.value.length)

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(idsCount.value, completedTitles)} ${idsCount.value} ${pluralize(idsCount.value, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(idsCount.value, processingTitles)} ${idsCount.value} ${pluralize(idsCount.value, props.nounTitlesProcessing)}`
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
      v-else-if="props.state === StatusStatesEnum.COMPLETED && ids.length"
      :pluralized-title="pluralizedCompletedTitle"
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
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
    </RecoverCompletedStatic>
  </div>
</template>
