<script setup lang="ts">
import type { StatusTools } from '~/types/StatusTools'
import SearchTasks from './ToolCall/Search/SearchTasks.vue'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'

const props = defineProps<{
  tool: StatusTools
  state: StatusStatesEnum
}>()

const stateClasses = computed(() => {
  return {
    'text-muted-foreground':
      props.state === StatusStatesEnum.COMPLETED || props.state === StatusStatesEnum.CANCELLED,
    'text-red-500': props.state === StatusStatesEnum.FAILED,
    'shimmer-text text-primary': props.state === StatusStatesEnum.IN_PROGRESS,
  }
})
</script>

<template>
  <SearchTasks
    v-if="props.tool.name === 'search_tasks'"
    :state="props.state"
    :content="props.tool.content"
    :state-classes="stateClasses"
  />
  <UpdateTasks
    v-if="props.tool.name === 'update_tasks'"
    :state="props.state"
    :content="props.tool.content"
    :state-classes="stateClasses"
  />
</template>
