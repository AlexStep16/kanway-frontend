<script setup lang="ts">
import { StatusStatesEnum } from '~/enums/StatusStatesEnum'
import type { IDeleteArchiveEntitiesContent } from '~/interfaces/Statuses/Content/IDeleteArchiveEntitiesContent'
import DeleteArchiveEntities from '../Base/DeleteArchive/DeleteArchiveEntities.vue'

const props = defineProps<{
  toolId: string
  chatId: string
  statusLogId: string
  threadId: string
  state: StatusStatesEnum
  content: IDeleteArchiveEntitiesContent
  stateClasses: Record<string, boolean>
}>()
</script>

<template>
  <DeleteArchiveEntities
    :tool-id="props.toolId"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.statusLogId"
    :state="props.state"
    :content="props.content"
    :state-classes="props.stateClasses"
    :noun-titles-processing="['пространство', 'пространства', 'пространств']"
    :noun-titles-completed="['пространство', 'пространства', 'пространств']"
  />
</template>
