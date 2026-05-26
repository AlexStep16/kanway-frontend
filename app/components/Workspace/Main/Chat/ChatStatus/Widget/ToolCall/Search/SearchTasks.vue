<script setup lang="ts">
import ChatTasksView from '~/components/Workspace/Main/Chat/Tasks/ChatTasksView.vue'
import type { ISearchEntitiesContent } from '~/interfaces/Statuses/Content/ISearchEntitiesContent'
import type { ITask } from '~/interfaces/domain/ITask'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import { SearchIcon } from 'lucide-vue-next'

const props = defineProps<{
  state: StatusStatesEnum
  content: ISearchEntitiesContent
  stateClasses: Record<string, boolean>
}>()

const completedTitles = ['Найдена', 'Найдены', 'Найдено']
const tasksTitles = ['задача', 'задачи', 'задач']

const ids = computed(() => {
  return props.content.ids || []
})

const idsCount = computed(() => ids.value.length)

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(idsCount.value, completedTitles)} ${idsCount.value} ${pluralize(idsCount.value, tasksTitles)}`
})

const tasks = computed(() => {
  return ids.value.map((id) => ({ id })) as ITask[]
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <template v-if="props.state === StatusStatesEnum.IN_PROGRESS">
      <SearchInProgress
        :human-readable-filters="props.content.filters"
        :state-classes="stateClasses"
      >
        <template #icon>
          <SearchIcon
            class="size-3"
            :class="props.stateClasses"
          />
        </template>
      </SearchInProgress>
    </template>
    <template v-else>
      <SearchCompletedDropdown
        v-if="props.state === StatusStatesEnum.COMPLETED && ids.length"
        :pluralized-title="pluralizedCompletedTitle"
      >
        <template #icon>
          <SearchIcon
            class="size-3"
            :class="props.stateClasses"
          />
        </template>
        <ChatTasksView :items="tasks" />
      </SearchCompletedDropdown>

      <SearchCompletedStatic
        v-else-if="props.state === StatusStatesEnum.COMPLETED"
        :pluralized-title="pluralizedCompletedTitle"
      >
        <template #icon>
          <SearchIcon
            class="size-3"
            :class="props.stateClasses"
          />
        </template>
      </SearchCompletedStatic>
    </template>
  </div>
</template>
