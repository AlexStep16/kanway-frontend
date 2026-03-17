<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  before: {
    order?: number
  }
  after: {
    order?: number
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasOrderChange = computed(() => {
  return props.before.order !== props.after.order
})
</script>

<template>
  <div class="flex gap-1 flex-wrap" v-if="hasOrderChange">
    <div class="flex flex-wrap text-xs" :class="baseBlockBeforeClasses">
      Позиция: {{ before.order ?? 1 }}
    </div>

    <div class="flex flex-wrap text-xs" :class="baseBlockAfterClasses">
      Позиция: {{ after.order ?? 1 }}
    </div>
  </div>
</template>
