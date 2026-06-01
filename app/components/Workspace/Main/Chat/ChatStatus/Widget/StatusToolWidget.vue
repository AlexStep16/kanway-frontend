<script setup lang="ts">
import type { StatusTools } from '~/types/StatusTools'
import SearchTasks from './ToolCall/SearchTasks.vue'
import UpdateTasks from './ToolCall/UpdateTasks.vue'
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'

const props = defineProps<{
  tool: StatusTools
  chatId: string
  threadId: string
  statusLogId: string
  state: StatusStatesEnum
}>()

const stateClasses = computed(() => {
  return {
    'text-muted-foreground':
      props.state === StatusStatesEnum.COMPLETED || props.state === StatusStatesEnum.CANCELLED,
    'text-red-500': props.state === StatusStatesEnum.FAILED,
    'shimmer-text text-primary': props.state === StatusStatesEnum.IN_PROGRESS,
    'text-yellow-500': props.state === StatusStatesEnum.AWAITING_CONFIRMATION,
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
    :tool-id="props.tool.id"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.tool.content"
    :state-classes="stateClasses"
  />
  <DeleteArchiveTasks
    v-if="props.tool.name === 'delete_archive_tasks'"
    :tool-id="props.tool.id"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.tool.content"
    :state-classes="stateClasses"
  />
  <CloneTasks
    v-if="props.tool.name === 'clone_tasks'"
    :tool-id="props.tool.id"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.tool.content"
    :state-classes="stateClasses"
  />
  <RecoverTasks
    v-if="props.tool.name === 'recover_tasks'"
    :tool-id="props.tool.id"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.tool.content"
    :state-classes="stateClasses"
  />
</template>
