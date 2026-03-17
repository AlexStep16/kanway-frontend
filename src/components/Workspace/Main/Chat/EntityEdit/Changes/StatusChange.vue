<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  before: {
    isCompleted?: boolean
  }
  after: {
    isCompleted?: boolean
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasStatusChange = computed(() => {
  if (props.before.isCompleted === undefined && props.after.isCompleted === undefined) return false

  return props.before.isCompleted !== props.after.isCompleted
})

function getStatusTitle(isCompleted?: boolean): string {
  if (isCompleted) return 'выполнено'
  else return 'не выполнено'
}
</script>

<template>
  <div class="flex gap-1 flex-wrap" v-if="hasStatusChange">
    <div class="flex flex-wrap text-xs" :class="baseBlockBeforeClasses">
      Статус: {{ getStatusTitle(before.isCompleted) }}
    </div>

    <div class="flex flex-wrap text-xs" :class="baseBlockAfterClasses" v-if="after.isCompleted">
      Статус: {{ getStatusTitle(after.isCompleted) }}
    </div>
  </div>
</template>
