<script setup lang="ts">
import type { Component } from 'vue'
import { SearchIcon, Square } from 'lucide-vue-next'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { ISearchEntitiesContent } from '~/interfaces/Statuses/Content/ISearchEntitiesContent'

const props = defineProps<{
  state: StatusStatesEnum
  content: ISearchEntitiesContent
  stateClasses: Record<string, boolean>
  nounTitlesProcessing: string
  nounTitlesCompleted: [string, string, string]
  viewComponent: Component
}>()

const completedTitles = ['Найдена', 'Найдены', 'Найдено']

const ids = computed(() => {
  return props.content.ids || []
})

const idsCount = computed(() => ids.value.length)

const pluralizedCompletedTitle = computed(() => {
  return `${pluralize(idsCount.value, completedTitles)} ${idsCount.value} ${pluralize(idsCount.value, props.nounTitlesCompleted)}`
})

const pluralizedProcessTitle = computed(() => {
  return `Ищу ${props.nounTitlesProcessing}`
})

const entities = computed(() => {
  return ids.value.map((id) => ({ id }))
})
</script>

<template>
  <div class="flex items-center gap-x-1 transition-all duration-300 select-none min-w-0">
    <SearchInProgress
      v-if="props.state === StatusStatesEnum.IN_PROGRESS"
      :pluralized-title="pluralizedProcessTitle"
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

    <SearchCompletedDropdown
      v-else-if="props.state === StatusStatesEnum.COMPLETED && ids.length"
      :pluralized-title="pluralizedCompletedTitle"
      :state-classes="stateClasses"
    >
      <template #icon>
        <SearchIcon
          class="size-3"
          :class="props.stateClasses"
        />
      </template>
      <component
        :is="props.viewComponent"
        :items="entities"
      />
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

    <SearchCompletedStatic
      v-else-if="props.state === StatusStatesEnum.CANCELLED"
      :pluralized-title="pluralizedProcessTitle"
    >
      <template #icon>
        <Square
          class="size-2.5"
          fill="currentColor"
        />
      </template>
    </SearchCompletedStatic>

    <ToolCallFailedBase
      v-else-if="props.state === StatusStatesEnum.FAILED"
      :title="pluralizedProcessTitle"
      :state-classes="stateClasses"
    />
  </div>
</template>
