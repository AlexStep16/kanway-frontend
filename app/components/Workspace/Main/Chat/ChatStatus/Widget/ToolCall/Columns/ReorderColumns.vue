<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { IReorderEntitiesContent } from '~/interfaces/Statuses/Content/IReorderEntitiesContent'
import ReorderEntities from '../Base/Reorder/ReorderEntities.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IReorderEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <ReorderEntities
    :tool-id="props.toolId"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    :noun-titles-processing="['колонки', 'колонок', 'колонок']"
    :noun-titles-completed="['колонки', 'колонок', 'колонок']"
  />
</template>
