<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { RefreshCcw } from 'lucide-vue-next'
import type { IUpdateEntitiesContent } from '~/interfaces/Statuses/Content/IUpdateEntitiesContent'

const props = defineProps<{
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
    <template v-if="props.state === StatusStatesEnum.IN_PROGRESS">
      <UpdateInProgress
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
    </template>
    <template v-else>
      <UpdateCompletedDropdown
        v-if="props.state === StatusStatesEnum.COMPLETED && ids.length"
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
    </template>
  </div>
</template>
