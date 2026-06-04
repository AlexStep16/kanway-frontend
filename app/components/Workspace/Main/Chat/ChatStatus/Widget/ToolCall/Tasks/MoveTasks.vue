<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { IMoveEntitiesContent } from '~/interfaces/Statuses/Content/IMoveEntitiesContent'
import MoveEntities from '../Base/Move/MoveEntities.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IMoveEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <MoveEntities
    :tool-id="props.toolId"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    :noun-titles-processing="['задачу', 'задачи', 'задач']"
    :noun-titles-completed="['задача', 'задачи', 'задач']"
  />
</template>
