<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { ICreateEntitiesContent } from '~/interfaces/Statuses/Content/ICreateEntitiesContent'
import CreateEntities from '../Base/Create/CreateEntities.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: ICreateEntitiesContent
  stateClasses: Record<string, boolean>
  isDemo?: boolean
}>()
</script>

<template>
  <CreateEntities
    :tool-id="props.toolId"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    :noun-titles-processing="['задачу', 'задачи', 'задач']"
    :noun-titles-completed="['задача', 'задачи', 'задач']"
    :is-demo="props.isDemo"
  >
    <template #demo-log>
      <DemoCreateTasks />
    </template>
  </CreateEntities>
</template>
