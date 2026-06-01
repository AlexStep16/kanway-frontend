<script setup lang="ts">
import type { StatusLog } from '~/types/StatusLog'
import StatusToolWidget from './Widget/StatusToolWidget.vue'

const props = defineProps<{
  log: StatusLog
  chatId: string
  threadId: string
}>()
</script>

<template>
  <StatusToolWidget
    v-if="props.log.type === 'tool'"
    :tool="props.log.content"
    :state="props.log.state"
    :chat-id="props.chatId"
    :thread-id="props.threadId"
    :status-log-id="props.log.id"
  />
</template>
