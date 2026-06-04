<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { IRecoverEntitiesContent } from '~/interfaces/Statuses/Content/IRecoverEntitiesContent'
import RecoverEntities from '../Base/Recover/RecoverEntities.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IRecoverEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <RecoverEntities
    :tool-id="props.toolId"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    :noun-titles-processing="['категорию', 'категории', 'категорий']"
    :noun-titles-completed="['категория', 'категории', 'категорий']"
  />
</template>
