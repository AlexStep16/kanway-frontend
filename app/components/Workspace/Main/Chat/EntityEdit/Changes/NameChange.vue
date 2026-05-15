<script setup lang="ts">
const props = defineProps<{
  before: {
    name: string
  }
  after: {
    name: string
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasNameChange = computed(() => {
  return props.before.name !== props.after.name
})
</script>

<template>
  <div class="flex flex-wrap gap-1" v-if="hasNameChange">
    <div
      class="flex items-center gap-x-1 shrink overflow-hidden min-w-0"
      :class="baseBlockBeforeClasses"
    >
      <span class="text-sm overflow-hidden wrap-break-word">
        {{ before.name }}
      </span>
    </div>

    <div
      class="flex items-center gap-x-1 shrink overflow-hidden min-w-0"
      :class="baseBlockAfterClasses"
    >
      <span class="text-sm overflow-hidden wrap-break-word">
        {{ after.name }}
      </span>
    </div>
  </div>
  <div class="flex flex-col gap-y-1" v-else>
    <div class="flex items-center gap-x-1 shrink overflow-hidden min-w-0 text-gray-800">
      <span class="text-sm overflow-hidden wrap-break-word">
        {{ before.name }}
      </span>
    </div>
  </div>
</template>
