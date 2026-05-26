<script setup lang="ts">
import type { StatusLog } from '~/types/StatusLog'
import StatusToolWidget from './Widget/StatusToolWidget.vue'

const props = defineProps<{
  log: StatusLog
}>()
</script>

<template>
  <StatusToolWidget
    v-if="props.log.type === 'tool'"
    :tool="props.log.content"
    :state="props.log.state"
  />
</template>
