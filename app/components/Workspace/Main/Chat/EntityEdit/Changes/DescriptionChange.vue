<script setup lang="ts">
import { TextAlignStart } from 'lucide-vue-next'

const props = defineProps<{
  before: {
    description?: string | null
  }
  after: {
    description?: string | null
  }
  baseBlockBeforeClasses?: string
  baseBlockAfterClasses?: string
}>()

const hasDescriptionChange = computed(() => {
  return props.before.description !== props.after.description
})
</script>

<template>
  <div
    class="flex flex-wrap gap-1"
    v-if="hasDescriptionChange"
  >
    <div
      class="flex items-center gap-x-1 shrink overflow-hidden min-w-0"
      :class="baseBlockBeforeClasses"
      v-if="before.description"
    >
      <span class="text-xs overflow-hidden wrap-break-word">
        {{ before.description }}
      </span>
    </div>
    <div
      class="flex items-center gap-x-1 shrink overflow-hidden min-w-0"
      :class="baseBlockBeforeClasses"
      v-else
    >
      <span class="text-sm overflow-hidden wrap-break-word">Нет описания</span>
    </div>

    <div
      class="flex items-center gap-x-1 shrink overflow-hidden min-w-0"
      :class="baseBlockAfterClasses"
      v-if="after.description"
    >
      <span class="text-xs overflow-hidden wrap-break-word">
        {{ after.description }}
      </span>
    </div>

    <div
      class="flex items-center gap-x-1 shrink overflow-hidden min-w-0"
      :class="baseBlockAfterClasses"
      v-else
    >
      <span class="text-xs overflow-hidden wrap-break-word">Нет описания</span>
    </div>
  </div>

  <div
    class="flex flex-col gap-y-1"
    v-else-if="before.description"
  >
    <div class="flex items-center text-xs gap-1 p-1 text-gray-500">
      <TextAlignStart class="size-3" />
      <span class="truncate max-w-full">{{ before.description }}</span>
    </div>
  </div>
</template>
