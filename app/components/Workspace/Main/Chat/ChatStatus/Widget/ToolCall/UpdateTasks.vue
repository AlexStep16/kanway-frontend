<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { RefreshCcw, CircleAlert, Square } from 'lucide-vue-next'
import type { IUpdateEntitiesContent } from '~/interfaces/Statuses/Content/IUpdateEntitiesContent'
import ApproveButtons from './ApproveButtons.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IUpdateEntitiesContent
  stateClasses: Record<string, boolean>
}>()

const processingTitles = ['Обновляю', 'Обновляю', 'Обновляю']
const tasksProcessingTitles = ['задачу', 'задачи', 'задач']

const completedTitles = ['Обновлена', 'Обновлены', 'Обновлено']
const tasksCompletedTitles = ['задача', 'задачи', 'задач']

const ids = computed(() => {
  return props.content.ids || []
})

const idsCount = computed(() => ids.value.length)

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(idsCount.value, completedTitles)} ${idsCount.value} ${pluralize(idsCount.value, tasksCompletedTitles)}`
})

const pluralizedProcessTitle = computed(() => {
  return `${pluralize(idsCount.value, processingTitles)} ${idsCount.value} ${pluralize(idsCount.value, tasksProcessingTitles)}`
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
      v-else-if="props.state === StatusStatesEnum.COMPLETED && ids.length"
      :pluralized-title="pluralizedCompletedTitle"
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
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
    </UpdateCompletedStatic>
  </div>
</template>
