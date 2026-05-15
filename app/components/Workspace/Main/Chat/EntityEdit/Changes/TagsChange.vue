<script setup lang="ts">
const props = defineProps<{
  before: {
    tags?: string[]
  }
  after: {
    tags?: string[]
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasTagsChange = computed(() => {
  return hasArrayChanges(props.before.tags, props.after.tags)
})
</script>

<template>
  <div class="flex gap-1 flex-wrap max-w-full" v-if="hasTagsChange">
    <div
      class="flex flex-wrap text-xs max-w-full"
      :class="baseBlockBeforeClasses"
      v-if="before.tags && before.tags.length"
    >
      <span class="truncate">{{ before.tags.map((t) => '#' + t).join(' ') }}</span>
    </div>
    <div
      class="flex flex-wrap text-xs gap-1 max-w-full"
      :class="baseBlockBeforeClasses"
      v-else-if="before.tags && before.tags.length === 0"
    >
      Нет тегов
    </div>

    <div
      class="flex flex-wrap text-xs max-w-full"
      :class="baseBlockAfterClasses"
      v-if="after.tags && after.tags.length"
    >
      <span class="truncate">{{ after.tags.map((t) => '#' + t).join(' ') }}</span>
    </div>
    <div
      class="flex flex-wrap text-xs max-w-full"
      :class="baseBlockAfterClasses"
      v-else-if="after.tags && after.tags.length === 0"
    >
      Нет тегов
    </div>
  </div>
  <div
    class="flex flex-wrap text-xs text-gray-500 gap-1 max-w-full"
    v-else-if="before.tags && before.tags.length"
  >
    {{ before.tags.map((t) => '#' + t).join(' ') }}
  </div>
</template>
