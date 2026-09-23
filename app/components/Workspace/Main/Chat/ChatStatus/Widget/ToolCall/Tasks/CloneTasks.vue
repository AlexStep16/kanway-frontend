<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { ICloneEntitiesContent } from '~/interfaces/Statuses/Content/ICloneEntitiesContent'
import CloneEntities from '../Base/Clone/CloneEntities.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: ICloneEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <CloneEntities
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
